const { normalizeAngularSpeedDirection } = require(`./gdtf-helpers.js`);

const deprecatedGdtfAttributes = {
  ActiveZone: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  AnimationIndexRotate: {
    // Controls the animation disk's index or its rotation speed.
    // Replaced by AnimationWheel(n)Pos in GDTF v1.0
    inheritFrom: `AnimationWheel(n)Pos`
  },
  AnimationIndexRotateMode: {
    // Changes control between selecting, indexing, and rotating the animation wheel.
    // Replaced by AnimationWheel(n)Mode in GDTF v1.0
    inheritFrom: `AnimationWheel(n)Mode`
  },
  AnimationOffset: {
    // Controls the animation disk's shaking.
    // Replaced by AnimationWheel(n)PosShake in GDTF v1.0
    inheritFrom: `AnimationWheel(n)PosShake`
  },
  AnimationWheel: {
    // Inserts a gobo disk into the beam. The disk has the ability to continuously index and rotate.
    // Replaced by AnimationWheel(n) in GDTF v1.0
    inheritFrom: `AnimationWheel(n)`
  },
  AnimationWheelMacro: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as AnimationWheel(n)Macro since GDTF v1.0
    inheritFrom: `AnimationWheel(n)Macro`
  },
  AnimationWheelPos: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as AnimationWheel(n)Pos since GDTF v1.0
    inheritFrom: `AnimationWheel(n)Pos`
  },
  AnimationWheelPosSpin: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as AnimationWheel(n)PosRotate since GDTF v1.0
    inheritFrom: `AnimationWheel(n)PosRotate`
  },
  BeamMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `AnimationIndexRotateMode`
  },
  Blower: {
    // Renamed to Blower(n) in GDTF v1.0
    inheritFrom: `Blower(n)`
  },
  'Color(n)Audio': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Color(n)WheelAudio since GDTF v0.88
    inheritFrom: `Color(n)WheelAudio`
  },
  'Color(n)Index': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Color(n)WheelIndex since GDTF v0.88
    inheritFrom: `Color(n)WheelIndex`
  },
  'Color(n)Random': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Color(n)WheelRandom since GDTF v0.88
    inheritFrom: `Color(n)WheelRandom`
  },
  'Color(n)Select': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Color(n)`
  },
  'Color(n)Spin': {
    // Renamed to Color(n)WheelSpin in GDTF v0.88
    inheritFrom: `Color(n)WheelSpin`
  },
  ColorMacroMSpeed: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `IntensityMSpeed`
  },
  'ColorRGB(n)': {
    // Controls the intensity of the fixture's color emitters.
    // Replaced by ColorRGB_* in GDTF v0.88
    oflType: `ColorIntensity`,
    oflProperty: `brightness`,
    defaultPhysicalEntity: `ColorComponent`,
    beforePhysicalPropertyHook(capability, gdtfCapability, attributeName) {
      const rgbNumber = parseInt(attributeName.slice(8));

      if (rgbNumber === 1) {
        capability.color = guessColorComponentName(gdtfCapability, `Red`, `Cyan`);
      }
      else if (rgbNumber === 2) {
        capability.color = guessColorComponentName(gdtfCapability, `Green`, `Magenta`);
      }
      else if (rgbNumber === 3) {
        capability.color = guessColorComponentName(gdtfCapability, `Blue`, `Yellow`);
      }
      else if (rgbNumber === 4) {
        capability.color = `Amber`;
      }
      else if (rgbNumber === 5) {
        capability.color = `White`;
      }
      else {
        // This is most likely wrong but enables the user to make an informed choice.
        capability.color = gdtfCapability._channelFunction._attribute.$.Pretty || `Unknown`;
      }
    }
  },
  'ColorRGB_B': {
    // Renamed to ColorAdd_B in GDTF v1.0
    inheritFrom: `ColorAdd_B`
  },
  'ColorRGB_BC': {
    // Renamed to ColorAdd_BC in GDTF v1.0
    inheritFrom: `ColorAdd_BC`
  },
  'ColorRGB_BM': {
    // Renamed to ColorAdd_BM in GDTF v1.0
    inheritFrom: `ColorAdd_BM`
  },
  'ColorRGB_C': {
    // Renamed to ColorAdd_C in GDTF v1.0
    inheritFrom: `ColorAdd_C`
  },
  'ColorRGB_CW': {
    // Renamed to ColorAdd_CW in GDTF v1.0
    inheritFrom: `ColorAdd_CW`
  },
  'ColorRGB_G': {
    // Renamed to ColorAdd_G in GDTF v1.0
    inheritFrom: `ColorAdd_G`
  },
  'ColorRGB_GC': {
    // Renamed to ColorAdd_GC in GDTF v1.0
    inheritFrom: `ColorAdd_GC`
  },
  'ColorRGB_GY': {
    // Renamed to ColorAdd_GY in GDTF v1.0
    inheritFrom: `ColorAdd_GY`
  },
  'ColorRGB_M': {
    // Renamed to ColorAdd_M in GDTF v1.0
    inheritFrom: `ColorAdd_M`
  },
  'ColorRGB_R': {
    // Renamed to ColorAdd_R in GDTF v1.0
    inheritFrom: `ColorAdd_R`
  },
  'ColorRGB_RM': {
    // Renamed to ColorAdd_RM in GDTF v1.0
    inheritFrom: `ColorAdd_RM`
  },
  'ColorRGB_RY': {
    // Renamed to ColorAdd_RY in GDTF v1.0
    inheritFrom: `ColorAdd_RY`
  },
  'ColorRGB_UV': {
    // Renamed to ColorAdd_UV in GDTF v1.0
    inheritFrom: `ColorAdd_UV`
  },
  'ColorRGB_W': {
    // Renamed to ColorAdd_W in GDTF v1.0
    inheritFrom: `ColorAdd_W`
  },
  'ColorRGB_WW': {
    // Renamed to ColorAdd_WW in GDTF v1.0
    inheritFrom: `ColorAdd_WW`
  },
  'ColorRGB_Y': {
    // Renamed to ColorAdd_Y in GDTF v1.0
    inheritFrom: `ColorAdd_Y`
  },
  ColorEffects: {
    // Renamed to ColorEffects(n) in GDTF v1.0
    inheritFrom: `ColorEffects(n)`
  },
  ColorMacro: {
    // Renamed to ColorMacro(n) in GDTF v1.0
    inheritFrom: `ColorMacro(n)`
  },
  Control: {
    // Renamed to Control(n) in GDTF v1.0
    inheritFrom: `Control(n)`
  },
  ControlAutofocus: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlBlackout: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlCalibrationMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlColorMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlCRIMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlDimmerCurve: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlDisplayIntensity: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlDMXInput: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlFanMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlFollowSpotMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlLamp: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlLampMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlPanTiltMode: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlParking: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlReset: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  ControlWhiteCount: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Control`
  },
  CTG: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `CTO`
  },
  Effects: {
    // Renamed to Effects(n) in GDTF v1.0
    inheritFrom: `Effects(n)`
  },
  EffectsFade: {
    // Renamed to Effects(n)Fade in GDTF v1.0
    inheritFrom: `Effects(n)Fade`
  },
  EffectsIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  EffectsMacro: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Effects`
  },
  'EffectsPar(n)': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Effects(n)Adjust(m) since GDTF v1.0
    inheritFrom: `Effects(n)Adjust(m)`
  },
  EffectsPos: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Effects(n)Pos since GDTF v1.0
    inheritFrom: `Effects(n)Pos`
  },
  EffectsPosIndex: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `EffectsPos`
  },
  EffectsPosSpin: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Effects(n)PosRotate since GDTF v1.0
    inheritFrom: `Effects(n)PosRotate`
  },
  EffectsRate: {
    // Renamed to Effects(n)Rate in GDTF v1.0
    inheritFrom: `Effects(n)Rate`
  },
  EffectsRateIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  EffectsSelectIndex: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Effects`
  },
  EffectsSelectSpin: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Effects`
  },
  EffectsSelectSpinDynamic: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Effects`
  },
  Effects2Macro: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  Effects2Par2: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `EffectsPar(n)`
  },
  Fan: {
    // Renamed to Fan(n) in GDTF v1.0
    inheritFrom: `Fan(n)`
  },
  Focus: {
    // Renamed to Focus(n) in GDTF v1.0
    inheritFrom: `Focus(n)`
  },
  FocusAdjust: {
    // Renamed to Focus(n)Adjust in GDTF v1.0
    inheritFrom: `Focus(n)Adjust`
  },
  FocusDistance: {
    // Renamed to Focus(n)Distance in GDTF v1.0
    inheritFrom: `Focus(n)Distance`
  },
  Fog: {
    // Renamed to Fog(n) in GDTF v1.0
    inheritFrom: `Fog(n)`
  },
  Frost: {
    // Renamed to Frost(n) in GDTF v1.0
    inheritFrom: `Frost(n)`
  },
  FrostHeavy: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Frost`
  },
  FrostLight: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Frost`
  },
  FrostMedium: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Frost`
  },
  FrostMSpeed: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Frost(n)MSpeed since GDTF v1.0
    inheritFrom: `Frost(n)MSpeed`
  },
  'Gobo(n)Audio': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Gobo1WheelAudio since GDTF v0.88
    inheritFrom: `Gobo1WheelAudio`
  },
  'Gobo(n)GoboIndex': undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  'Gobo(n)GoboShakeIndex': undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  'Gobo(n)PosIndex': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Gobo(n)Pos`
  },
  'Gobo(n)PosRotation': {
    // Renamed to Gobo(n)PosRotate in GDTF v0.88
    inheritFrom: `Gobo(n)PosRotate`
  },
  'Gobo(n)PosSpin': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Gobo(n)PosRotate`
  },
  'Gobo(n)Random': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    // Officially supported as Gobo(n)WheelRandom since GDTF v0.88
    inheritFrom: `Gobo(n)WheelRandom`
  },
  'Gobo(n)RandomAudio': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Gobo(n)WheelAudio`
  },
  'Gobo(n)Select': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Gobo(n)`
  },
  'Gobo(n)SelectIndex': undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  'Gobo(n)Shake': {
    // Renamed to Gobo(n)WheelShake in GDTF v0.88
    inheritFrom: `Gobo(n)WheelShake`
  },
  'Gobo(n)SelectShakeIndex': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Gobo(n)SelectShake`
  },
  'Gobo(n)SelectShakeSpin': undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  'Gobo(n)Spin': {
    // Renamed to Gobo(n)WheelSpin in GDTF v0.88
    inheritFrom: `Gobo(n)WheelSpin`
  },
  GoboWheelMSpeed: {
    // Renamed to GoboWheel(n)MSpeed in GDTF v1.0
    inheritFrom: `GoboWheel(n)MSpeed`
  },
  Haze: {
    // Renamed to Haze(n) in GDTF v1.0
    inheritFrom: `Haze(n)`
  },
  Prism: {
    // Renamed to Prism(n) in GDTF v0.88
    inheritFrom: `Prism(n)`
  },
  PrismPos: {
    // Renamed to Prism(n)Pos in GDTF v0.88
    inheritFrom: `Prism(n)Pos`
  },
  PrismPosIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  PrismPosRotation: {
    // Renamed to Prism(n)PosRotate in GDTF v0.88
    inheritFrom: `Prism(n)PosRotate`
  },
  PrismPrismIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  'Prism(n)PosIndex': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Prism(n)Pos`
  },
  'Prism(n)PosRotation': {
    // Renamed to Prism(n)PosRotate in GDTF v0.88
    inheritFrom: `Prism(n)PosRotate`
  },
  'Prism(n)PosSpin': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Prism(n)PosRotate`
  },
  'Prism(n)PrismIndex': undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  'Prism(n)SelectIndex': {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `Prism(n)`
  },
  PrismMSpeed: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `IrisMSpeed`
  },
  Shaper: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  ShaperIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  ShaperPos: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    oflType: `Rotation`,
    oflProperty: `angle`,
    defaultPhysicalEntity: `Angle`
  },
  ShaperPosIndex: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    oflType: `Rotation`,
    oflProperty: `angle`,
    defaultPhysicalEntity: `Angle`
  },
  ShaperPosSpin: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    oflType: `Rotation`,
    oflProperty: `speed`,
    defaultPhysicalEntity: `AngularSpeed`,
    beforePhysicalPropertyHook(capability, gdtfCapability) {
      normalizeAngularSpeedDirection(gdtfCapability);
    }
  },
  ShaperRotIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  ShaperSelectIndex: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  ShaperSelectSpin: undefined, // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
  Zoom: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    oflType: `Zoom`,
    oflProperty: `angle`,
    defaultPhysicalEntity: `Angle`
  },
  ZoomMSpeed: {
    // From https://gitlab.com/petrvanek/gdtf-libraries/blob/master/gdtf.xsd
    inheritFrom: `IrisMSpeed`
  }
};

/**
 * @param {Object} gdtfCapability The enhanced <ChannelSet> XML object.
 * @param {String} primaryColor The color that this capability is most likely.
 * @param {String} secondaryColor The color that this capability is second most likely.
 * @returns {String} Either the primary, or the secondary color.
 */
function guessColorComponentName(gdtfCapability, primaryColor, secondaryColor) {
  const name = (gdtfCapability._channelFunction._attribute.$.Pretty || ``).toLowerCase();

  if (name.includes(secondaryColor.toLowerCase())) {
    return secondaryColor;
  }

  if (name.includes(primaryColor.toLowerCase())) {
    return primaryColor;
  }

  if (name.includes(secondaryColor.charAt(0).toLowerCase())) {
    return secondaryColor;
  }

  return primaryColor;
}

module.exports = deprecatedGdtfAttributes;
