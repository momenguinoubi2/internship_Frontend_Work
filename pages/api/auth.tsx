import React, { useState, useContext, createContext } from 'react'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} from '@apollo/client'
import { useCookies } from 'react-cookie';
interface AppContextInterface {
  username: string;
  autpasswordhor: string;
}

type Props={
    children:JSX.Element
  }

const authContext = createContext({})

export function AuthProvider({ children }:Props) {
  const auth = useProvideAuth()


  return (
    
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>
        {children}
      </ApolloProvider>
    </authContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(authContext)
  
}

function useProvideAuth() {
  const [authToken, setAuthToken] = useState(null)
  const [cookies, setCookie] = useCookies(['token']);
  const isSignedIn = () => {    
    if (authToken||cookies.token) {
      console.log(authToken)
      console.log(cookies.token)
      console.log("truuuuue")
      return true
    } else {
      return false
    }
  }

  const getAuthHeaders = () => {
    if (!authToken) return null

    return {
      authorization: `Bearer ${authToken}`,
    }
  }

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: 'http://127.0.0.1:8000/graphql',
      headers: getAuthHeaders(),
    })

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  }
  
  const signIn = async ({ username, password }:{username:String, password:String }) => {
    const client = createApolloClient()
    const LoginMutation = gql`
    mutation loginmutation ($username: String!,$password: String!) {
    login(input:{username:$username, password:$password}) {
      access_token
      refresh_token
      expires_in
      token_type
      user {
        id
        email
        name
        created_at
        updated_at
      }
    }
  }
  `

    const result = await client.mutate({
      mutation: LoginMutation,
      variables: { username, password },
      
    })
    console.log(result)
    setCookie("token",result?.data?.login?.access_token)
    console.log(cookies)
    var auth = localStorage.getItem('token');
    if (result?.data?.login?.access_token) {
      setAuthToken(result.data.login.access_token)
    }
    if(auth){
      console.log("true")      
      // var authItem = JSON.parse(auth)
      // var token = authItem.token
      // setAuthToken(token)
    }else{
      console.log("false")      
    }
  
  }

  const signOut = () => {
    setAuthToken(null)
  }

  return {
    setAuthToken,
    isSignedIn,
    signIn,
    signOut,
    createApolloClient,
  }
}



