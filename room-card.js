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
      }
      .title {
        font-size: 24px;
        margin: 0;
        color: var(--text-primary-color, white);
      }
      .display-entity {
        display: flex;
        align-items: center;
        font-size: 24px;
        color: var(--text-primary-color, white);
      }
      .display-icon {
        width: 24px;
        height: 24px;
        margin-right: 4px;
      }
      .display-value {
        font-size: 24px;
        color: var(--text-primary-color, white);
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        margin-top: 16px;
      }
      .control {
        flex: 1 1 25%;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        padding: var(--control-padding, 8px);
      }
      @media (max-width: 800px) {
        .control {
          flex: 1 1 33%;
        }
      }
      @media (max-width: 600px) {
        .control {
          flex: 1 1 50%;
        }
      }
      .control:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      .icon-wrapper {
        position: relative;
        margin: 0 auto 2px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--icon-wrapper-size);
        height: var(--icon-wrapper-size);
      }
      .icon-background {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        background: var(--icon-background, none);
        width: 100%;
        height: 100%;
      }
      .icon-wrapper ha-icon {
        color: var(--icon-color, var(--text-primary-color, white));
        z-index: 1;
        --mdc-icon-size: var(--icon-size);
      }
      .control span {
        display: block;
        text-align: center;
        color: var(--text-primary-color, white);
        margin: 0;
        line-height: 1.2;
      }
      .control .state {
        display: block;
        text-align: center;
        font-size: 12px;
        color: var(--text-primary-color, white);
        margin-top: 2px;
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
    const onColor = this.config.on_color || '#fdd835';
    const offColor = this.config.off_color || 'var(--text-primary-color, white)';
    const textColor = this.config.text_color || 'var(--text-primary-color, white)';
    const overlayStyle = this.config.background_overlay === false ? 'background: none;' : 'background: rgba(0, 0, 0, 0.5);';

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

    return html`
      <ha-card style="background-image: url('${backgroundImage}');">
        <div class="overlay" style="${overlayStyle}">
          <div class="header">
            <h1 class="title" style="color: ${textColor};">${this.config.title}</h1>
            ${displayContent}
          </div>
          <div class="controls">
            ${controls.map(control => this.renderControl(control))}
          </div>
        </div>
      </ha-card>
    `;
  }

  renderControl(control) {
    const entity = this.hass.states[control.entity];
    if (!entity) return html``;

    const icon = control.icon || entity.attributes.icon || 'mdi:help-circle';
    const name = control.name || entity.attributes.friendly_name || 'Dispositivo';
    const state = entity.state;
    const isActive = ['on', 'open', 'playing', 'home'].includes(state);
    const onColor = this.config.on_color || '#fdd835';
    const offColor = this.config.off_color || 'var(--text-primary-color, white)';
    const iconColor = isActive ? onColor : offColor;
    const textColor = this.config.text_color || 'var(--text-primary-color, white)';
    const onIconBackground = this.config.on_icon_background || 'linear-gradient(135deg, #fdd835 0%, #fdd835 100%)';
    const iconSize = this.config.icon_size || '80px';
    const nameFontSize = this.config.name_font_size || '18px';
    const controlPadding = '8px'; // Ajusta este valor según tus necesidades

    let action = () => {
      this.hass.callService('homeassistant', 'toggle', { entity_id: control.entity });
    };

    if (control.tap_action) {
      action = () => this.handleAction(control.tap_action, control.entity);
    }

    return html`
      <div class="control" @click="${action}" style="padding: ${controlPadding};">
        <div class="icon-wrapper" style="
          --icon-wrapper-size: ${iconSize};
        ">
          ${isActive
            ? html`<div class="icon-background" style="
              --icon-background: ${onIconBackground};
            "></div>`
            : ''}
          <ha-icon
            icon="${icon}"
            style="
              --icon-size: calc(${iconSize} * 0.75);
              --icon-color: ${iconColor};
            "
          ></ha-icon>
        </div>
        <span style="color: ${textColor}; font-size: ${nameFontSize};">${name}</span>
        <span class="state" style="color: ${textColor};">${state}</span>
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

  getCardSize() {
    return 3;
  }
}

customElements.define('room-card', RoomCard);
