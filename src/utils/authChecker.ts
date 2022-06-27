
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { AuthChecker } from "type-graphql";


const customAuthChecker: AuthChecker<any, any> = ({ context }, roles) => {

  if (context.token) {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(context.token, process.env.JSON_TOKEN_KEY as Secret) as JwtPayload;

      if (!decoded) {
        return false
      }

      context.payload = decoded
      // comparer decoded.role et roles
      if (roles.includes(decoded.role.label) || roles.length === 0) {
        // grant access if the roles overlap
        return true;
      }

      return false

    } catch (err) {
      return false

    }
  }
  return false


}

export default customAuthChecker