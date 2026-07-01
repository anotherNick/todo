import "./styles.css";
import { pubSub, events } from "./controllers/PubSub.js";
import "./controllers/model-controller.js";
import "./controllers/view-controller.js";

pubSub.publish(events.init);