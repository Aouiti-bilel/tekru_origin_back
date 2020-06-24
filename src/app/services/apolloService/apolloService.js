// Apollo imports
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Set Origin Apollo Server link
const originURI = process.env.REACT_APP_GRAPHQL_URL;

// Set the Apollo Server http link
const originServerUri = createUploadLink({
    uri: originURI
});

// Creat the Apollo Client
const client = new ApolloClient({
    link: originServerUri,
    cache: new InMemoryCache({
        addTypename: false,
    })
});

export default client;
