/* states:
 * unit category, Box
 * left unit, Box
 * right unit, Box
 * left input, Box
 * right input, Box
 */

import { useState } from "react";

const MEASUREMENTS = [
	{
		name: "Temperature",
		units: [
			{
				unit: "Fahrenheit",
				toStandard: (temp) => myRound((temp - 32) * (5 / 9) + 273.15),
				toSpecific: (temp) => myRound((temp - 273.15) * (9 / 5) + 32),
			},
			{
				unit: "Celsius",
				toStandard: (temp) => myRound(temp + 273.15),
				toSpecific: (temp) => myRound(temp - 273.15),
			},
			{
				unit: "Kelvin",
				toStandard: (temp) => myRound(temp),
				toSpecific: (temp) => myRound(temp),
			},
		],
	},
	{
		name: "Distance",
		units: [
			{
				unit: "Meters",
				toStandard: (dist) => myRound(dist),
				toSpecific: (dist) => myRound(dist),
			},
			{
				unit: "Kilometers",
				toStandard: (dist) => myRound(dist / 1000),
				toSpecific: (dist) => myRound(dist * 1000),
			},
			{
				unit: "Miles",
				toStandard: (dist) => myRound(dist * 1609),
				toSpecific: (dist) => myRound(dist / 1609),
			},
		],
	},
];

function myRound(n) {
	return Math.round(n * 100) / 100;
}

export default function App() {
	return <Box></Box>;
}

function Box() {
	const [activeMeasurement, setActiveMeasurement] = useState(MEASUREMENTS[0].name);
	const [leftUnit, setLeftUnit] = useState(MEASUREMENTS[0].units[0].unit);
	const [rightUnit, setRightUnit] = useState(MEASUREMENTS[0].units[1].unit);
	const [leftInput, setLeftInput] = useState("");
	const [rightInput, setRightInput] = useState("");

	const activeMeasurementObject = MEASUREMENTS.find((m) => m.name === activeMeasurement);
	const activeMeasurementUnits = activeMeasurementObject.units;
	const activeUnits = activeMeasurementObject.units;

	// pass the needed stuff instead of relying on closures
	const calculate = (event) => {
		const userInput = event.target.value;
		if (userInput !== "-" && !Number.isNaN(userInput)) {
			const numericalInput = Number(userInput);

			const leftUnitObject = activeMeasurementUnits.find((unit) => unit.unit === leftUnit);
			const rightUnitObject = activeMeasurementUnits.find((unit) => unit.unit === rightUnit);

			let standard;
			if (event.target.id === "left") {
				standard = leftUnitObject.toStandard(numericalInput);
				const rightSpecific = rightUnitObject.toSpecific(standard);
				setRightInput(rightSpecific);
				setLeftInput(userInput);
			} else {
				standard = rightUnitObject.toStandard(numericalInput);
				const leftSpecific = leftUnitObject.toSpecific(standard);
				setLeftInput(leftSpecific);
				setRightInput(userInput);
			}
		}
	};

	return (
		<div className="container">
			<UnitCategory
				mesasurements={MEASUREMENTS}
				setMeasurement={setActiveMeasurement}
			></UnitCategory>
			<UnitArea
				id="left"
				units={activeUnits}
				currentUnit={leftUnit}
				setUnit={setLeftUnit}
				currentData={leftInput}
				updateInput={calculate}
				currentMeasurement={activeMeasurement}
			></UnitArea>
			<h1>=</h1>
			<UnitArea
				id="right"
				units={activeUnits}
				currentUnit={rightUnit}
				setUnit={setRightUnit}
				currentData={rightInput}
				updateInput={calculate}
				currentMeasurement={activeMeasurement}
			></UnitArea>
		</div>
	);
}

function UnitCategory({ mesasurements, setMeasurement }) {
	const options = mesasurements.map((m) => {
		return (
			<option key={m.name} value={m.name}>
				{m.name}
			</option>
		);
	});

	const handleChange = (event) => {
		setMeasurement(event.target.value);
	};

	return (
		<select className="category" onChange={handleChange}>
			{options}
		</select>
	);
}

function UnitArea({
	id,
	units,
	currentUnit,
	setUnit,
	currentData,
	updateInput,
	currentMeasurement,
}) {
	const options = units.map((u) => {
		return (
			<option key={u.unit} value={u.unit}>
				{u.unit}
			</option>
		);
	});

	const handleChange = (event) => {
		setUnit(event.target.value);
	};

	return (
		<div className="area">
			<input id={id} onChange={updateInput} value={currentData}></input>
			<select value={currentUnit} onChange={handleChange}>
				{options}
			</select>
		</div>
	);
}
