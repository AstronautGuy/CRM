import { Svix } from "svix";
import { env } from "~/env";

// Export a singleton instance of the Svix client
export const svix = new Svix(env.SVIX_TOKEN);
