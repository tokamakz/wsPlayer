import { defineCustomElement } from 'vue';
import WsPlayerVue from './components/WsPlayer.vue';
const WsPlayer = defineCustomElement(WsPlayerVue);

customElements.define('ws-player', WsPlayer);
