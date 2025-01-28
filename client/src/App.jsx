import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { loginSuccess } from './store/slices/authSlice';
import Auth from './utils/auth';
import Nav from './components/Nav';
import { idbPromise } from './utils/helpers';

// Function to render the App component
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check auth on mount
    if (Auth.loggedIn()) {
      const token = Auth.getToken();
      const user = Auth.getProfile();
      dispatch(loginSuccess({ token, user }));
    }

    // Sync Index Database with Redux store
    ['cart', 'products', 'categories'].forEach(async store => {
      const data = await idbPromise(store, 'get');
      if (data?.length) {
        switch(store) {
          case 'cart':
            dispatch({ type: 'cart/addMultipleToCart', payload: data });
            break;
          case 'products':
            dispatch({ type: 'products/updateProducts', payload: data });
            break;
          case 'categories':
            dispatch({ type: 'categories/updateCategories', payload: data });
            break;
        }
      }
    });
  }, [dispatch]);

  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default App;

// ORIGINAL CODE
// import { Outlet } from 'react-router-dom';
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   createHttpLink,
// } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';

// import Nav from './components/Nav';
// import { StoreProvider } from './utils/GlobalState';

// const httpLink = createHttpLink({
//   uri: '/graphql',
// });

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('id_token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <StoreProvider>
//         <Nav />
//         <Outlet />
//       </StoreProvider>
//     </ApolloProvider>
//   );
// }

// export default App;
