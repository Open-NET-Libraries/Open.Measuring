"use strict";

module Measuring
{
	var INVALIDTOTYPE:string = "Invalid Unit (to type).";
	var INVALIDFROMTYPE:string = "Invalid Unit (from type).";

	export class Measurement
	{

		constructor(public value, public units:Measurement.Unit)
		{

		}

		static get FEETPERMILE():number { return 5280; }

		static get INCHESPERFEET():number { return 12; }

		static get MILESPERKILOMETER():number { return 0.62137; }

		static get FEETPERMETER():number { return 3.2808; }

		static get INCHESPERCENTIMETER():number { return 0.39370; }

		public static product(type:Measurement.Unit, measurements:Measurement[]):number
		{
			if(!measurements.length)
				return NaN;
			var value:number = 1;
			measurements.forEach(m=>value *= m.toUnits(type));
			return value;
		}

		public static sum(type:Measurement.Unit, measurements:Measurement[]):number
		{
			var value:number = 0;
			measurements.forEach(m=>value += m.toUnits(type));
			return value;
		}

		toUnits(toType:Measurement.Unit):number
		{
			var _ = this;
			return Measurement.convert(_.value,_.units,toType);
		}

		convertTo(newType:Measurement.Unit):Measurement
		{
			return new Measurement(this.toUnits(newType), newType);
		}

		static convert(value:number, fromType:Measurement.Unit, toType:Measurement.Unit):number
		{

			if(!Measurement.Unit.isValid(toType))
				throw new Error(INVALIDTOTYPE);

			while(fromType!=toType)
			{
				switch(fromType)
				{
					case Measurement.Unit.Miles:

						switch(toType)
						{
							case Measurement.Unit.Kilometers:
								value /= Measurement.MILESPERKILOMETER;
								fromType = Measurement.Unit.Kilometers;
								break;

							default:
								value *= Measurement.FEETPERMILE;
								fromType = Measurement.Unit.Feet;
								break;

						}
						break;


					case Measurement.Unit.Feet:

						switch(toType)
						{
							// Convert...
							case Measurement.Unit.Meters:
								value /= Measurement.FEETPERMETER;
								fromType = Measurement.Unit.Meters;
								break;

							// Upscale...
							case Measurement.Unit.Kilometers:
							case Measurement.Unit.Miles:
								value /= Measurement.FEETPERMILE;
								fromType = Measurement.Unit.Miles;
								break;

							// Downscale...
							default:
								value *= Measurement.INCHESPERFEET;
								fromType = Measurement.Unit.Inches;
								break;

						}
						break;


					case Measurement.Unit.Kilometers:

						switch(toType)
						{
							// Convert...
							case Measurement.Unit.Miles:
								value *= Measurement.MILESPERKILOMETER;
								fromType = Measurement.Unit.Miles;
								break;

							// Downscale...
							default:
								value *= 1000;
								fromType = Measurement.Unit.Meters;
								break;
						}

						break;


					case Measurement.Unit.Meters:

						switch(toType)
						{
							// Convert...
							case Measurement.Unit.Feet:
								value *= Measurement.FEETPERMETER;
								fromType = Measurement.Unit.Feet;
								break;

							// Upscale...
							case Measurement.Unit.Kilometers:
							case Measurement.Unit.Miles:
								value /= 1000;
								fromType = Measurement.Unit.Kilometers;
								break;

							// Downscale...
							default:
								value *= 100;
								fromType = Measurement.Unit.Centimeters;
								break;

						}
						break;


					// Upscale...
					case Measurement.Unit.Millimeters:
						value /= 10;
						fromType = Measurement.Unit.Centimeters;
						break;


					case Measurement.Unit.Inches:

						switch(toType)
						{
							// Convert...
							case Measurement.Unit.Centimeters:
							case Measurement.Unit.Millimeters:
								value /= Measurement.INCHESPERCENTIMETER;
								fromType = Measurement.Unit.Centimeters;
								break;

							// Upscale...
							default:
								value /= Measurement.INCHESPERFEET;
								fromType = Measurement.Unit.Feet;
								break;
						}

						break;

					case Measurement.Unit.Centimeters:
						switch(toType)
						{
							// Convert...
							case Measurement.Unit.Inches:
								value *= Measurement.INCHESPERCENTIMETER;
								fromType = Measurement.Unit.Inches;
								break;

							// Downscale...
							case Measurement.Unit.Millimeters:
								value *= 10;
								fromType = Measurement.Unit.Millimeters;
								break;

							// Upscale...
							default:
								value /= 100;
								fromType = Measurement.Unit.Meters;
								break;
						}
						break;


					default:
						throw new Error(INVALIDFROMTYPE);

				}

			}

			return value;
		}

		get inches():number {
			return this.toUnits(Measurement.Unit.Inches);
		}

		get feet():number {
			return this.toUnits(Measurement.Unit.Feet);
		}

		get miles():number {
			return this.toUnits(Measurement.Unit.Miles);
		}

		get meters():number {
			return this.toUnits(Measurement.Unit.Meters);
		}
	}

	export module Measurement {

		export enum Unit
		{
			Inches,
			Feet,
			Miles,

			Millimeters,
			Centimeters,
			Meters,
			Kilometers
		}

		export module Unit {
			export function isValid(units:Measurement.Unit) {
				switch(units){
					case Measurement.Unit.Inches:
					case Measurement.Unit.Feet:
					case Measurement.Unit.Miles:
					case Measurement.Unit.Millimeters:
					case Measurement.Unit.Centimeters:
					case Measurement.Unit.Meters:
					case Measurement.Unit.Kilometers:
						return true;
				}
				return false;
			}
		}

		Object.freeze(Unit);
	}

	export class Temperature {

		constructor(public value, public unit:Temperature.Unit)
		{

		}

		static fahrenheitToCelsius(f:number):number {
			return (f - 32) * 5/9;
		}

		static celsiusToFahrenheit(c:number):number {
			return c * 9/5 + 32;
		}

		static celsiusToKelvin(c:number):number {
			return c + 273;
		}

		static kelvinToCelcius(k:number):number {
			return k - 273;
		}

		toUnit(toType:Temperature.Unit):number
		{
			var _ = this;
			return Temperature.convert(_.value,_.unit,toType);
		}

		convertTo(newType:Temperature.Unit):Temperature
		{
			return new Temperature(this.toUnit(newType), newType);
		}

		static convert(value:number, fromType:Temperature.Unit, toType:Temperature.Unit):number
		{
			while(fromType!=toType)
			{
				switch(fromType)
				{
					case Temperature.Unit.Fahrenheit:
						switch(toType) {
							case Temperature.Unit.Kelvin:
							case Temperature.Unit.Celsius:
								value = Temperature.fahrenheitToCelsius(value);
								fromType = Temperature.Unit.Celsius;
								break;
							default:
								throw new Error(INVALIDTOTYPE);
						}
						break;

					case Temperature.Unit.Kelvin:
						switch(toType) {
							case Temperature.Unit.Fahrenheit:
							case Temperature.Unit.Celsius:
								value = Temperature.kelvinToCelcius(value);
								fromType = Temperature.Unit.Celsius;
								break;
							default:
								throw new Error(INVALIDTOTYPE);
						}
						break;

					case Temperature.Unit.Celsius:
						switch(toType) {
							case Temperature.Unit.Fahrenheit:
								return Temperature.celsiusToFahrenheit(value);
							case Temperature.Unit.Kelvin:
								return Temperature.celsiusToKelvin(value);
							default:
								throw new Error(INVALIDTOTYPE);
						}
						break;

					default:
						throw new Error(INVALIDFROMTYPE);
				}
			}

			return value;
		}


		get fahrenheit():number {
			return this.toUnit(Temperature.Unit.Fahrenheit);
		}

		get celsius():number {
			return this.toUnit(Temperature.Unit.Celsius);
		}

		get kelvin():number {
			return this.toUnit(Temperature.Unit.Kelvin);
		}

	}

	export module Temperature {

		export enum Unit
		{
			Fahrenheit,
			Celsius,
			Kelvin
		}

		export module Unit {
			export function isValid(units:Temperature.Unit) {
				switch(units){
					case Temperature.Unit.Fahrenheit:
					case Temperature.Unit.Celsius:
					case Temperature.Unit.Kelvin:
						return true;
				}
				return false;
			}
		}

		Object.freeze(Unit);
	}


}
export = Measuring;
