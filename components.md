# Building blocks available in posts

| Component | Use |
|---|---|
| `<Sidenote>…</Sidenote>` | A margin note, numbered automatically |
| `<Figure caption="…" wide>…</Figure>` | A numbered figure; `wide` spans the margin column too |
| `<CalibrationShift before="…" after="…" beforeLabel="…" afterLabel="…" />` | Confidence minus accuracy per dataset, before and after training (JEV study data) |
| `<ReliabilityPair model="…" datasets={['…', '…']} />` | Two reliability diagrams side by side (JEV study data) |
| `<EceEstimators model="…" />` | ECE estimators and noise floor per dataset (JEV study data) |
| `<ModelBars />` | Every model's summary scores with 95% intervals (JEV study data) |
| `<JevBoard />` | The full JEV calibration leaderboard |
