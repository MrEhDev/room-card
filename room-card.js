import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.4.0/lit-element.js?module';

class RoomCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static get styles() {
    return css`
      ha-card {
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        --ha-card-background: var(--card-background-color, white);
        color: var(--primary-text-color);
      }
      .overlay {
        background: rgba(0, 0, 0, 0.5);
        padding: 16px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .title {
        font-size: 24px;
        margin: 0;
        color: var(--primary-text-color);
      }
      .display-entity-wrapper {
        display: flex;
        align-items: flex-end; /* Ajuste para aguacatec: false */
        justify-content: flex-end;
        flex-direction: column; /* Colocación vertical */
      }
      .display-entity, .humidity-value {
        font-size: 16px; /* Ajuste de tamaño para aguacatec: false */
        color: var(--primary-text-color);
        margin-left: 25px; /* Ajuste del margen izquierdo de la humedad */
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        margin-top: 16px;
        justify-content: space-evenly;
      }
      .controls.aguacatec-true {
        flex-direction: row;
        width: 60%;
        position: relative;
        left: 140px;
        bottom: 10px;
      }
      .control {
        padding: 4px;
        width: 30%;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
      }
      .control:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      .icon-wrapper {
        margin: 0 auto 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-wrapper ha-icon {
        color: var(--icon-color, var(--primary-text-color));
        z-index: 1;
        --mdc-icon-size: var(--icon-size, 60px); /* Tamaño preestablecido de 60px para aguacatec: false */
      }
      .control span {
        display: block;
        text-align: center;
        color: var(--primary-text-color);
        margin: 0;
        line-height: 1.2;
      }
      .control .state {
        display: block;
        text-align: center;
        font-size: 12px;
        color: var(--primary-text-color);
        margin-top: 2px;
      }
      .room-icon {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50%;  /* El room_icon ocupará la mitad del tamaño de la tarjeta */
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle, var(--accent-color) 0%, transparent 60%);
        border-radius: 50%;
      }
      .room-icon .icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 25%;  /* Ícono en la esquina superior derecha del background */
        height: 25%;
      }
      .badge {
        position: absolute;
        top: 0;
        right: 0;
        width: 20%;
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: none;
      }
    `;
  }

  setConfig(config) {
    if (!config.title) {
      throw new Error('El título es obligatorio.');
    }
    this.config = config;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const backgroundImage = this.config.background || '';
    const controls = this.config.controls || [];
    const titleColor = this.config.title_color || 'var(--primary-text-color)';
    const onColor = this.config.on_color || 'var(--paper-item-icon-active-color)';
    const offColor = this.config.off_color || 'var(--paper-item-icon-color)';
    const textColor = this.config.text_color || 'var(--primary-text-color)';
    const showRoomIcon = this.config.room_icon ? true : false;
    const roomIconColor = this.config.room_icon_color || 'radial-gradient(circle, var(--accent-color) 0%, transparent 60%)';
    const aguacatec = this.config.aguacatec || false;
    const badge = this.getBadgeInfo();  // Método para obtener la información de la medalla

    let displayContent = '';
    if (this.config.display_entity) {
      const displayEntity = this.hass.states[this.config.display_entity];
      if (displayEntity) {
        const displayValue = displayEntity.state;
        const displayIcon = this.config.display_icon || displayEntity.attributes.icon || '';
        const displayUnit = this.config.display_unit || displayEntity.attributes.unit_of_measurement || '';
        displayContent = html`
          <div class="display-entity">
            ${displayIcon ? html`<ha-icon icon="${displayIcon}" class="display-icon"></ha-icon>` : ''}
            <span class="display-value">${displayValue}${displayUnit}</span>
          </div>
        `;
      }
    }

    // Renderizar la humedad si se define el sensor de humedad
    let humidityContent = '';
    if (this.config.display_humidity_sensor) {
      const humidityEntity = this.hass.states[this.config.display_humidity_sensor];
      if (humidityEntity) {
        const humidityValue = humidityEntity.state;
        humidityContent = html`
          <div class="humidity-value">${humidityValue}%</div>
        `;
      }
    }

    return html`
      <ha-card style="background-image: url('${backgroundImage}');">
        <div class="overlay" style="background: rgba(0, 0, 0, 0.5);">
          <div class="header">
            ${aguacatec && showRoomIcon
              ? html`<div class="room-icon" style="background: ${roomIconColor};">
                  <ha-icon icon="${this.config.room_icon}" class="icon" style="color: white;"></ha-icon>
                  ${badge ? html`
                    <div class="badge" style="background: ${badge.background};">
                      <ha-icon icon="${badge.icon}" style="color: white;"></ha-icon>
                    </div>` : ''}
                </div>`
              : html``}
            <h1 class="title" style="color: ${titleColor};">${this.config.title}</h1>
            ${!aguacatec && showRoomIcon
              ? html`
                <div class="display-entity-wrapper">
                  <ha-icon icon="${this.config.room_icon}" style="color: ${roomIconColor};"></ha-icon>
                  ${displayContent}
                  ${humidityContent}
                </div>
              `
              : ''}
          </div>
          ${aguacatec ? html`${displayContent}${humidityContent}` : ''}
          <div class="controls ${aguacatec ? 'aguacatec-true' : ''}">
            ${controls.map(control => this.renderControl(control, aguacatec))}
          </div>
        </div>
      </ha-card>
    `;
  }

  renderControl(control, aguacatec) {
    const entity = this.hass.states[control.entity];
    if (!entity) return html``;

    const icon = control.icon || entity.attributes.icon || 'mdi:help-circle';
    const name = control.name || entity.attributes.friendly_name || 'Dispositivo';
    const state = entity.state;
    const isActive = ['on', 'open', 'playing', 'home'].includes(state);
    const iconColor = isActive ? this.config.on_color || 'var(--paper-item-icon-active-color)' : this.config.off_color || 'var(--paper-item-icon-color)';
    const iconSize = aguacatec ? '22px' : '60px';  // Tamaño del ícono para aguacatec: true y false
    const nameFontSize = aguacatec ? '15px' : '18px';  // Ajuste del tamaño de la fuente
    const textColor = this.config.text_color || 'var(--primary-text-color)';
    const showName = this.config.show_name !== false;
    const showState = this.config.show_state !== false;
    const controlPadding = '8px';

    let action = () => {
      this.hass.callService('homeassistant', 'toggle', { entity_id: control.entity });
    };

    if (control.tap_action) {
      action = () => this.handleAction(control.tap_action, control.entity);
    }

    return html`
      <div class="control" @click="${action}" style="padding: ${controlPadding}; width: 50%;">  <!-- Controles en columnas -->
        <div class="icon-wrapper">
          <ha-icon
            icon="${icon}"
            style="
              --icon-size: ${iconSize};
              --icon-color: ${iconColor};
            "
          ></ha-icon>
        </div>
        ${showName
          ? html`<span style="color: ${textColor}; font-size: ${nameFontSize};">${name}</span>`
          : ''}
        ${showState
          ? html`<span class="state" style="color: ${textColor};">${state}</span>`
          : ''}
      </div>
    `;
  }

  handleAction(actionConfig, defaultEntityId) {
    const action = actionConfig.action || 'more-info';
    switch (action) {
      case 'toggle':
        this.hass.callService('homeassistant', 'toggle', { entity_id: defaultEntityId });
        break;
      case 'more-info':
        const event = new Event('hass-more-info', { composed: true });
        event.detail = { entityId: defaultEntityId };
        this.dispatchEvent(event);
        break;
      case 'call-service':
        const [domain, service] = actionConfig.service.split('.', 2);
        const serviceData = actionConfig.service_data || {};
        this.hass.callService(domain, service, serviceData);
        break;
      case 'navigate':
        if (actionConfig.navigation_path) {
          window.history.pushState(null, '', actionConfig.navigation_path);
          const navEvent = new Event('location-changed', { composed: true });
          this.dispatchEvent(navEvent);
        }
        break;
      // Puedes añadir más acciones según sea necesario
    }
  }

  getBadgeInfo() {
    const displayEntity = this.hass.states[this.config.display_entity];
    if (!displayEntity) return null;

    const temperature = parseFloat(displayEntity.state);
    const humidityEntity = this.config.display_humidity_sensor
      ? this.hass.states[this.config.display_humidity_sensor]
      : displayEntity;
    const humidity = humidityEntity ? parseFloat(humidityEntity.state) : 0;

    const maxTemp = this.config.max_temperature || 26;
    const minTemp = this.config.min_temperature || 18;
    const humidityThreshold = this.config.humidity_threshold || 60;

    if (humidity === humidityThreshold) {
      return { icon: 'mdi:water', background: '#2196F3' }; // Gota con fondo azul
    }
    if (temperature >= maxTemp) {
      return { icon: 'mdi:fire', background: '#f44336' }; // Llama con fondo rojo
    }
    if (temperature <= minTemp) {
      return { icon: 'mdi:snowflake', background: '#2196F3' }; // Copo de nieve con fondo azul
    }

    return null;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('room-card', RoomCard);

