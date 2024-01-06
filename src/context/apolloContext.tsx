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
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "@apollo/client/link/error";
import { IUser } from "../@types/types";

export let client: ApolloClient<NormalizedCacheObject>;
const ApolloContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // const [uri, setUri] = useState("");

  // const fetchUri = async () => {
  //   const res = await invoke("get_environment_variable", { name: "URI" });
  //   setUri(res as string);
  // };

  // useEffect(() => {
  //   fetchUri();
  // }, []);
  const uri = "https://apis.work-space.me/graphql";

  const authLink = new ApolloLink((operation, forward) => {
    const user: IUser | null = JSON.parse(
      localStorage.getItem("user") as string
    );
    operation.setContext((ctx: DefaultContext) => ({
      headers: {
        authorization: user ? `Bearer ${user?.token}` : "",
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
    new WebSocketLink({
      uri: uri.replace(/^http/g, "ws"),
      options: {
        // lazy: true,
        reconnect: true,
        connectionCallback(error, result) {
          console.log("connectionCallback", error, result);
        },
        connectionParams: () => {
          const user: IUser | null = JSON.parse(
            localStorage.getItem("user") as string
          );
          return {
            database: user?.domain ?? "",
            authorization: user ? `Bearer ${user?.token}` : "",
          };
        },
      },
    }),
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
