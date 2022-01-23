import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Store, { useStore } from 'statium';

import { getUser, setUser } from './actions/user.js';

import Header from './components/Header/Header.jsx';
import Footer from './components/Footer.jsx';
import Notifications from './components/NotificationProvider.jsx';
import { Alerts } from './components/Alerts.jsx'

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Register from './pages/Register.jsx';
import Article from './pages/Article.jsx';
import Editor from './pages/Editor.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import LoadMask from './components/LoadMask.jsx';

const initialState = {
  user: null,
  appReady: false,
};

const App = () => {
  // navigate() function is used in many actions, and the only way
  // to get the reference to this function is to call useNavigate
  // hook, which is only available at rendering time in functional
  // components, as per the rules of hooks.
  // One way to work with this limitation is keep track of every
  // action that needs to call navigate(), make sure that every
  // component dispatching such action is a functional component,
  // call useNavigate() in each of those components and pass the
  // reference to `navigate` function manually to every action
  // that makes use of it. Needless to say, this approach is
  // _really_ cumbersome.
  // So instead we are grabbing the reference to `navigate` once
  // and passing it to all components and actions down the tree
  // via the Statium Store `data` prop. It's as easy as that.
  const navigate = useNavigate();

  return (
    <Store tag="App" data={{ navigate }} initialState={initialState}>
      <Index />
    </Store>
  );
}

const Index = () => {
  const { state, dispatch } = useStore();

  // Technically we don't need dispatch as the hook dependency since
  // it's a function with a stable identity that does not change
  // between renderings, and `[dispatch]` is functionally equivalent
  // to an empty dependency array that causes the effect to be invoked
  // only once.
  // That said, if we don't include `dispatch` in dependencies, the
  // ESLint react-hooks/exhaustive-deps rule will warn about it.
  // In a real application we might choose to deal with this differently,
  // in this demo it makes more sense to just include `dispatch` in
  // dependencies and provide this explanation.
  useEffect(() => {
    dispatch(initialize);
  }, [dispatch]);

  if (!state.appReady) {
    return (
      <>
        <Header />
        <LoadMask loading={true} />
      </>
    );
  }

  return (
    <Notifications>
      <Header />
      <Alerts />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/editor/:slug" element={<Editor />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/@:username/favorites" element={<Profile tab="favorites" />} />
        <Route path="/@:username" element={<Profile tab="authored" />} />
        <Route path="/tag/:selectedTag" element={<Home tab="tag" />} />
        <Route path="/feed" element={<Home tab="feed" />} />
        <Route path="/" element={<Home tab="global" />} />
      </Routes>

      <Footer />
    </Notifications>
  );
};

const initialize = async ({ set, dispatch }) => {
  // Get the user record from window local storage token,
  // and validate it with the back end. If no token was stored
  // or is invalid, user will be null and we will use tokenless
  // API for non-authenticated experience.
  const user = await dispatch(getUser);

  await dispatch(setUser, user);

  await set({ appReady: true });
};

export default App;
