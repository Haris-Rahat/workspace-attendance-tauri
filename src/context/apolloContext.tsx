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
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { onError } from "@apollo/client/link/error";
import { ComponentChildren, FunctionComponent } from "preact";
import { user } from "../services/signals/signals";

type Props = {
  children: ComponentChildren;
};

// const user: User = JSON.parse(localStorage.getItem("user") as string);

const ApolloContextProvider: FunctionComponent<Props> = ({ children }) => {
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

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext((ctx: DefaultContext) => ({
      headers: {
        authorization: user.value.token ? `Bearer ${user.value.token}` : "", // however you get your token
        ...ctx.headers,
        database: user.value.domain ? user.value.domain : "",
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
            authorization: user.value.token
              ? `Bearer ${user.value.token}`
              : null,
            database: user.value.domain ? user.value.domain : "",
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

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, concat(authLink, link)]),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloContextProvider;
