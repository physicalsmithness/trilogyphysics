# Multi-stage (4-to-6 mark) calculation catalogue - AQA Trilogy

Provenance: Smith's Google Sheet "List of Possible (Four-to-)Six-Marker Calc Questions for AQA Trilogy Physics" (synced 2026-06-11, https://docs.google.com/spreadsheets/d/1Gm6Y_CDmum8rSIyQsmBcyLdKYOwSsBmEzA0oGwIQALA). The canonical reference for the chained-calculation question shapes across every topic.

Note (d038): this lists the bigger 4-to-6-mark CHAINS. Below them sits a common ~3-mark tier where one prep step (graph read-off, a difference like delta-theta, a resultant sum, a conversion) precedes a single formula. Those are not listed here but are a deliberate authoring category, see QUESTION_TYPES 'Calculation complexity tiers'.

How to use (all Authoring chats): these are the high-value multi-stage items. Author them as chained `calc_workings` with `stages` (d029); each stage is its own 4-line block, linked by `gate:{kind:"from_previous_part"}` with ECF. **Likelihood (L0-5)** is Smith's estimate of how likely AQA asks it, a coverage/priority signal (prioritise high-L chains, but still cover comprehensively per d007). **Harder?** flags a tougher variant and why (good for d2/d3 calibration). Cross-topic chains reference shared atoms, do not duplicate (d030).

## 6.1 Energy (Paper 1)
- **General energy transfers** (L5, 6mk): any combination; toolkit Ek=1/2mv^2, Ep=mgh, Ee=1/2ke^2, dE=mc d-theta, E=mL, W=Fs, P=IV or P=I^2R, E=Pt, efficiency.
- **Falling/rising objects** (L high, 4mk): Ek=1/2mv^2 <-> Ep=mgh.
- **Energy in a spring** (L2, 6mk): W=mg -> F=ke -> Ee=1/2ke^2. Harder: not obvious you cannot just use the GPE drop.
- **Lifting power** (L5, 6mk): Ep=mgh -> E=Pt (KE ignored at the top). Maybe efficiency / P=IV / P=I^2R.
- **Accelerating power from rest** (L5, 6mk): Ek=1/2mv^2 -> E=Pt.
- **Accelerating power not from rest** (L1.5, 6mk): Ek twice -> E=Pt (cannot add velocities).
- **KE -> heat** (L4, 6mk): Ek=1/2mv^2 -> dE=mc d-theta (or E=mL). Harder if masses differ (car vs brakes).
- **GPE -> heat** (L3.5, 6mk): Ep=mgh -> dE=mc d-theta.
- **KE/GPE/heat with no mass** (L3, 6mk): cancel mass, e.g. 1/2mv^2 = mgh. Harder: mass-cancelling confuses many.
- **Projectile from spring, horizontal** (L4, 6mk): Ee=1/2ke^2 -> Ek=1/2mv^2.
- **Projectile from spring, vertical** (L4, 6mk): Ee=1/2ke^2 -> Ep=mgh.
- **Falling with initial KE** (L3, 6mk): KE+GPE at top -> KE at ground -> v. Harder: KE used twice.

## 6.2 Electricity (Paper 1)
- **Potential-divider voltages** (L5, 6mk): Rt=R1+R2 -> V=IR (whole, find I) -> V=IR (one resistor). Or the ratio method. NB the reciprocal parallel calc is OUT of Trilogy (d024); this is series.
- **Various** (L5, 6mk): toolkit V=IR, Q=It, E=VQ, P=IV, Rt sum, P=I^2R, circuit rules, E=Pt.
- **Circuit rules + P=IV + E=Pt** (L4, 5mk): rules -> P=IV -> E=Pt.
- **Circuit rules + V=IR** (L4, 4mk).
- **Circuit rules + Q=It** (L4, 4mk).

## 6.3 Particle Model (Paper 1)
- **Weight from density** (L5, 6mk): volume -> rho=m/V -> W=mg. Harder if mass/weight confused (last step dropped).
- **Heaters for heating** (L5, 6mk): P=I^2R or P=IV -> E=Pt -> dE=mc d-theta.
- **Heaters for melting/boiling** (L5, 6mk): P -> E=Pt -> E=mL.
- **Heating and melting/boiling** (L3, 6mk): E=Pt, then dE=mc d-theta and E=mL with a subtraction. Harder: two energies + subtraction.

## 6.5 Forces (Paper 2)
- **Forces + changing velocity (given time)** (L5, 6mk): F=ma -> a=(v-u)/t. F is resultant.
- **Forces + changing velocity (given distance)** (L4.5, 6mk): F=ma -> v^2-u^2=2as.
- **Acceleration from light gates (time between)** (L2, 6mk): v=d/t twice (mask width) -> a=(v-u)/t.
- **Acceleration from light gates (distance between)** (L1.5, 6mk): v=d/t twice -> v^2-u^2=2as.
- **Hanging mass from spring** (L5, 6mk): W=mg -> F=ke. Harder: people use mass as F (forget to weight).
- **Up/down force + weight (rockets)** (L5, 6mk): W=mg -> resultant -> F=ma. Harder: forget the weight.
- **Average speed from v-t graph** (L2, 4mk): area = distance -> v=d/t. Technique not obvious.
- **Ruler-drop reaction time** (L3.5, 6mk): v^2-u^2=2as (a=g, u=0) -> a=(v-u)/t. Two accel formulae.
- **Work to accelerate/stop a vehicle** (L4, 6mk): Ek=1/2mv^2 -> W=Fs. (Work done is really Forces, Paper 2.)
- **Work to accelerate (already moving)** (L1, 6mk): W=Fs -> Ek twice.
- **Weight on two planets** (L3, 4mk): W=mg twice (find m, then other g).

## 6.6 Waves (Paper 2)
- **Travelling waves** (L5, 5mk): v=f-lambda -> v=d/t.
- **Travelling waves with period** (L4, 6mk): f=1/T -> v=f-lambda -> v=d/t.
- **Echoes/reflections** (L5, 4mk): v=d/t with d = 2 x distance to reflector (clap-echo, ultrasound depth, radar).

## 6.7 Electromagnetism (Paper 2, HT)
- **Wire lifted by motor effect / on a balance** (L5, 6mk): F=BIl -> W=mg. Harder: force direction (Fleming + Newton's 3rd decides add vs subtract).
- **Force on wire given V and R** (L3, 6mk): V=IR -> F=BIl.
- **Force on wire given charge and time** (L1, 6mk): Q=It -> F=BIl.
- **Motor effect and power** (L3, 6mk): F=BIl -> P=IV.

## Cross-topic note
The 6.5 and 6.7 chains invoke KE, GPE and W=mg whose atoms live in Energy 6.1 / the shared registry; reference them (d030/OQ-D), do not duplicate. Work done sits in Forces (Paper 2) though taught in Energy.
