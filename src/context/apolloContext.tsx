import React, { PropsWithChildren } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
  from,
  ApolloLink,
  DefaultContext,
  concat,
  NormalizedCacheObject,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { onError } from "@apollo/client/link/error";
import { IUser } from "../@types/types";

const user: IUser = JSON.parse(localStorage.getItem("user") as string);

export let client: ApolloClient<NormalizedCacheObject>;
const ApolloContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // get the authentication token from local storage if it exists

  // const [uri, setUri] = useState("");

  // const fetchUri = async () => {
  //   const res = await invoke("get_environment_variable", { name: "URI" });
  //   setUri(res as string);
  // };

  // useEffect(() => {
  //   fetchUri();
  // }, []);
  const uri = "https://apis.work-space.me/graphql";

  const token = user?.token;

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext((ctx: DefaultContext) => ({
      headers: {
        authorization: token ? `Bearer ${token}` : "", // however you get your token
        ...ctx.headers,
      },
    }));
    return forward(operation);
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    new GraphQLWsLink(
      createClient({
        url: uri.replace(/^http/g, "ws"),
        connectionParams: async () => {
          return {
            authorization: token ? `Bearer ${token}` : null,
          };
        },
      })
    ),
    authLink.concat(new HttpLink({ uri }))
  );

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      // Handle Errors
    }

    forward(operation);
  });

  client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, concat(authLink, link)]),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloContextProvider;
