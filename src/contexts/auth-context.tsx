import { createContext, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/auth";

type UserType = {
  id: string;
  avatar: string;
  name: string;
  email: string;
  token: string;
};

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
} as const;

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null as UserType | null,
};

type StateType = typeof initialState;

type ActionType = {
  type: typeof HANDLERS[keyof typeof HANDLERS];
  payload?: any;
};

const handlers: Record<keyof typeof HANDLERS, (state: StateType, action: ActionType) => StateType> =
  {
    [HANDLERS.INITIALIZE]: (state, action) => {
      const user = action.payload;

      return {
        ...state,
        ...// if payload (user) is provided, then is authenticated
        (user
          ? {
              isAuthenticated: true,
              isLoading: false,
              user,
            }
          : {
              isAuthenticated: false,
              isLoading: false,
              user: null,
            }),
      };
    },
    [HANDLERS.SIGN_IN]: (state, action) => {
      const user = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    },
    [HANDLERS.SIGN_OUT]: (state) => {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    },
  };

const reducer = (state: StateType, action: ActionType): StateType =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const useInitAuthContext = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAuthChange = async (user: firebase.User | null) => {
    if (!user) {
      dispatch({ type: "INITIALIZE" });
      return;
    }
    const token = await user.getIdToken();
    dispatch({
      type: "INITIALIZE",
      payload: {
        avatar: user.photoURL ?? "",
        email: user.email ?? "",
        id: user.uid,
        name: user.displayName ?? "",
        token,
      } as UserType,
    });
  };

  useEffect(() => {
    const fbauth = firebase.auth();
    const unsubscribe = fbauth.onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const fbauth = firebase.auth();
    let userData: firebase.User;

    try {
      const userCreds = await fbauth.signInWithEmailAndPassword(email, password);
      if (!userCreds.user) throw new Error();
      userData = userCreds.user;
    } catch (error) {
      throw new Error("Login failed please check your username or password");
    }

    const user = {
      id: userData.uid,
      avatar: userData.photoURL ?? "",
      name: userData.displayName ?? "",
      email: userData.email ?? "",
      token: await userData.getIdToken(),
    } as UserType;

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email: string, name: string, password: string) => {
    throw new Error("Sign up is not implemented");
    return;
  };

  const signOut = async () => {
    const fbauth = firebase.auth();
    await fbauth.signOut();
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  };
};

export const AuthContext = createContext<ReturnType<typeof useInitAuthContext> | undefined>(
  undefined
);

export const AuthProvider = (props) => {
  const { children } = props;

  const { signIn, signUp, signOut, ...state } = useInitAuthContext();

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => {
  const contextValue = useContext(AuthContext);
  if (!contextValue) throw new Error("AuthProvider was not found");
  return contextValue;
};
