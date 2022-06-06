import { defineCustomElement } from 'vue';
import WsPlayer from './components/WsPlayer.vue';
const WsPlayer = defineCustomElement(WsPlayer);

customElements.define('WsPlayer', WsPlayer);
