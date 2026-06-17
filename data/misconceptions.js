/* ============================================================================
   Trilogy Physics — misconception registry (window.TRILOGY_MISCONCEPTIONS)
   ----------------------------------------------------------------------------
   The canonical registry SCHEMA.md points the engine at ("Misconception
   registry — ECM misconceptions schema (slug / topic / label / description)",
   d016). Built from the RATIFIED 6.2 vocabulary proposal §3
   (review/trilogy_electricity_vocabulary_proposal.md, ratified 2026-06-08):
   ECM-ported (valid), port-trimmed for Trilogy scope, and NEW_FLAG slugs
   surfaced from the AQA Trilogy bank with examiner-report evidence. `topic`
   uses the 6.2 subtag (or "cross" / "ws" for cross-topic and
   working-scientifically slugs). The retired `wrong_power_form_for_topology`
   (no P=V²/R in Trilogy) and all parallel-reciprocal / resistivity / potential-
   divider slugs are deliberately absent (out of Trilogy scope, proposal §3).

   Owned with Authoring; Architecture ratifies. The engine reads labels from
   here at mount; per-topic config may override. Authors set a distractor's
   `misconception_id` to one of these slugs.
   ============================================================================ */

window.TRILOGY_MISCONCEPTIONS = [
  // ── ported from ECM, valid as-is ─────────────────────────────────────────
  { slug: "confused_v_and_i", topic: "resistance_ohm", label: "Confused voltage and current", description: "Substituted voltage for current or vice versa." },
  { slug: "treated_V_as_I", topic: "power_electrical", label: "Put pd into the current slot", description: "Wrong quantity into the formula slot (V where I belongs)." },
  { slug: "treated_I_as_V", topic: "power_electrical", label: "Put current into the pd slot", description: "Wrong quantity into the formula slot (I where V belongs)." },
  { slug: "wrong_formula_rearrangement", topic: "resistance_ohm", label: "Rearranged the formula wrongly", description: "Rearranged V=IR (or P=VI) the wrong way." },
  { slug: "swapped_factor_in_squared", topic: "power_electrical", label: "Squared the wrong factor", description: "In P=I²R squared R instead of I." },
  { slug: "forgot_to_square_in_power", topic: "power_electrical", label: "Did not square in P=I²R", description: "Omitted the squaring of the current in P=I²R." },
  { slug: "picked_given_value", topic: "resistance_ohm", label: "Answered with a given value", description: "Answered with a value lifted straight from the stem." },
  { slug: "ammeter_in_parallel", topic: "circuit_basics", label: "Ammeter in parallel", description: "Ammeter placed in parallel (would short-circuit)." },
  { slug: "voltmeter_in_series", topic: "circuit_basics", label: "Voltmeter in series", description: "Voltmeter placed in series (would block current)." },
  { slug: "meter_kinds_interchangeable", topic: "circuit_basics", label: "Ammeter/voltmeter interchangeable", description: "Treated ammeter and voltmeter as the same." },
  { slug: "swapped_meter_letter", topic: "circuit_basics", label: "Misread A vs V in the meter", description: "Read A vs V inside the meter circle wrongly." },
  { slug: "current_consumed_at_components", topic: "series_parallel", label: "Current used up in a component", description: "Thinks current is consumed in a resistor or bulb." },
  { slug: "current_splits_when_not_branching", topic: "series_parallel", label: "Current splits with no junction", description: "Divided current where there is no branch." },
  { slug: "voltage_same_in_series", topic: "series_parallel", label: "Equal pd across series components", description: "Assumed equal pd across components in series (supply pd actually = sum). Strongly evidenced." },
  { slug: "equal_share_assumption", topic: "series_parallel", label: "Equal share between unequal branches", description: "Assumed current/voltage splits equally between unequal branches." },
  { slug: "bulb_brightness_from_resistance_only", topic: "series_parallel", label: "Brightness from resistance alone", description: "Predicted brightness from R alone, ignoring current." },
  { slug: "switch_state_inverted", topic: "series_parallel", label: "Read switch state inverted", description: "Read a closed switch as open, or vice versa." },
  { slug: "qualitative_inference_doubted", topic: "series_parallel", label: "Doubted a determinate answer", description: "Picked 'cannot tell without values' when topology + formula decide it." },
  { slug: "confused_definition_with_law", topic: "iv_characteristics", label: "R=V/I read as Ohm's law", description: "Treated R=V/I as Ohm's law rather than the definition of resistance." },
  { slug: "misread_iv_graph_for_ohmic", topic: "iv_characteristics", label: "Misread the I–V linearity", description: "Read a non-linear curve as ohmic, or a linear one as non-ohmic. Evidenced." },
  { slug: "ohmic_confused_with_metal", topic: "iv_characteristics", label: "'Metal so ohmic'", description: "'It's a metal so it's ohmic', ignoring filament heating. Evidenced." },
  { slug: "ohmic_confused_with_variable_resistor", topic: "iv_characteristics", label: "LDR/thermistor read as ohmic", description: "Read an LDR or thermistor characteristic as ohmic." },
  { slug: "ohms_law_misread_temperature_role", topic: "iv_characteristics", label: "Denied the constant-T condition", description: "Denied the constant-temperature precondition for Ohm's law. Evidenced." },
  { slug: "cell_battery_confusion", topic: "circuit_basics", label: "Cell vs battery symbol", description: "Single cell vs multi-cell battery symbol confused." },
  { slug: "power_supply_vs_cell", topic: "circuit_basics", label: "Power supply read as a cell", description: "DC power-supply box read as a cell." },
  { slug: "heater_resistor_swap", topic: "circuit_basics", label: "Heater vs resistor symbol", description: "Heater vs fixed-resistor symbol confused." },
  { slug: "fuse_resistor_swap", topic: "circuit_basics", label: "Fuse vs resistor symbol", description: "Fuse vs fixed-resistor symbol confused." },
  { slug: "ldr_vs_led", topic: "circuit_basics", label: "LDR vs LED symbol", description: "LDR vs LED symbol confused (arrow direction)." },
  { slug: "diode_vs_led", topic: "circuit_basics", label: "Diode vs LED symbol", description: "Diode vs LED symbol confused (light-emission arrows)." },
  { slug: "units_off_by_factor", topic: "cross", label: "Right number, wrong prefix", description: "Right number, wrong prefix (mA vs A). Evidenced. See prefix_not_converted." },
  { slug: "rounding_mistake", topic: "cross", label: "Rounding/precision slip", description: "Engine-derived near-miss under a plausible rounding regime (d032)." },

  // ── ported but trimmed for Trilogy scope ─────────────────────────────────
  { slug: "swapped_series_parallel", topic: "series_parallel", label: "Swapped series/parallel rules", description: "Applied series reasoning where parallel holds, or vice versa (qualitative; the reciprocal-formula reading is out of Trilogy)." },
  { slug: "topology_indifferent_assumption", topic: "series_parallel", label: "Topology does not matter", description: "Assumed topology does not change the current/voltage distribution." },

  // ── NEW_FLAG, surfaced from the AQA Trilogy bank (examiner-evidenced) ─────
  { slug: "diode_reverse_current_nonzero", topic: "iv_characteristics", label: "Reverse diode current not zero", description: "On a reversed diode, said current 'reverses' or 'decreases' rather than being zero. Evidenced (<1 in 10 scored both marks)." },
  { slug: "iv_line_one_quadrant_only", topic: "iv_characteristics", label: "Ohmic line in one quadrant", description: "Drew the ohmic I–V line only in the 1st quadrant, omitting the 3rd. Evidenced." },
  { slug: "drew_lamp_curve_for_ohmic", topic: "iv_characteristics", label: "Lamp curve for ohmic", description: "Drew a filament-lamp curve when asked for the ohmic straight-line characteristic. Evidenced." },
  { slug: "proportionality_stated_as_increases", topic: "iv_characteristics", label: "'Increases' not 'proportional'", description: "Described R∝L (or I∝V) as 'increases as ... increases' instead of naming direct proportionality. Evidenced (gained no marks)." },
  { slug: "power_of_ten_evaluation_error", topic: "cross", label: "Power-of-ten evaluation slip", description: "Correct method, place-value slip in the division/multiplication (e.g. 3.0/2000 read as 1.5). Evidenced." },
  { slug: "mains_values_confused", topic: "mains_ac_dc", label: "Wrong mains pd/frequency", description: "Gave the wrong UK mains pd or frequency, or swapped the two (e.g. 50 V / 230 Hz)." },
  { slug: "live_neutral_earth_confused", topic: "mains_safety", label: "Live/neutral/earth mismatched", description: "Mismatched a wire to its colour or role (live/neutral/earth)." },
  { slug: "transformer_role_confused", topic: "national_grid", label: "Step-up/step-down inverted", description: "Step-up vs step-down function inverted, or 'decreases power'." },
  { slug: "grid_loss_reason_missed", topic: "national_grid", label: "Missed the grid loss reason", description: "Could not link high transmission voltage to lower current to lower I²R heating loss." },

  // ── cross-topic / working-scientifically (owner placement = Architecture) ──
  { slug: "prefix_not_converted", topic: "cross", label: "SI prefix not converted", description: "Generalised SI-prefix failure (mA→A, kΩ→Ω). Subsumes units_off_by_factor. Codex unit_handling = prefix_strip." },
  { slug: "repeatability_reproducibility_confused", topic: "ws", label: "Repeatability vs reproducibility", description: "WS slug; appears on electricity RP items. Belongs to the shared WS taxonomy (Overview)." },
  { slug: "freehand_line_not_ruled", topic: "ws", label: "Best-fit line drawn freehand", description: "WS / graph technique; best-fit line drawn freehand. Shared WS taxonomy (Overview)." },

  // ── registered post-d041 (added by the 6.2 author at wiring: d040/d047/d048 + corrected ECM ports) ──
  { slug: "filament_resistance_falls", topic: "iv_characteristics", label: "Filament resistance falls", description: "Thought a filament lamp's resistance falls (or drops to zero) as it heats, rather than rising. NEW_FLAG, registered d040." },
  { slug: "sensor_direction_reversed", topic: "iv_characteristics", label: "Sensor response direction reversed", description: "Reversed a thermistor/LDR response: said resistance rises as temperature/light rises, when it falls. NEW_FLAG, registered d040." },
  { slug: "treated_bypass_as_active", topic: "series_parallel", label: "Bypassed component treated as active", description: "Ignored a wire that short-circuits a component, leaving it in the analysis. Qualitative topology; corrected OUT->PORT in the ECM assessment." },
  { slug: "disguised_parallel_missed", topic: "series_parallel", label: "Disguised parallel missed", description: "Read the topology wrongly when the diagram disguises series vs parallel. Qualitative; corrected OUT->PORT." },
  { slug: "appliance_energy_confused_power_energy", topic: "energy_appliances", label: "Power vs energy confused", description: "Conflated power (rate, W) with energy (total, J): read a power rating as total energy, or judged energy by power alone ignoring time. NEW_FLAG, registered d047." },
  { slug: "sensor_stimulus_confused", topic: "circuit_basics", label: "Wrong sensor stimulus", description: "Confused which quantity a sensor responds to: thermistor (temperature) vs LDR (light). NEW_FLAG, registered d048." },
  { slug: "ac_dc_confused", topic: "mains_ac_dc", label: "a.c./d.c. confused", description: "Conflated alternating and direct supplies: read an a.c. trace as d.c., or thought mains is d.c. like a battery. NEW_FLAG, registered d048." }
];
