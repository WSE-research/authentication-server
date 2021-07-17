import NoAuthenticationForSessionJson from "./errors/NoAuthenticationForSession.json";
import NoStateJson from "./errors/NoState.json";
import NoStateScopeRedirectURIJson from "./errors/NoStateScopeRedirectURI.json";
import InternalServerErrorJson from "./errors/InternalServerError.json";
import NoJWTJson from "./errors/NoJWT.json";

namespace ErrorResponses {
  export const NoAuthenticationForSession = NoAuthenticationForSessionJson;
  export const NoState = NoStateJson;
  export const NoStateScopeRedirectURI = NoStateScopeRedirectURIJson;
  export const InternalServerError = InternalServerErrorJson;
  export const NoJWT = NoJWTJson;
}


export { ErrorResponses };

