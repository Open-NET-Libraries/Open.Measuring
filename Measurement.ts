
import UnitType = require("UnitType");
class Measurement
{

	constructor(public value, public units:UnitType)
	{

	}

	static get FEETPERMILE():number { return 5280; }

	static get INCHESPERFEET():number { return 12; }

	static get MILESPERKILOMETER():number { return 0.62137; }

	static get FEETPERMETER():number { return 3.2808; }

	static get INCHESPERCENTIMETER():number { return 0.39370; }

	public static product(type:UnitType, measurements:Measurement[]):number
	{
		if(!measurements.length)
			return NaN;
		var value:number = 1;
		measurements.forEach(m=>value *= m.toUnits(type));
		return value;
	}

	public static sum(type:UnitType, measurements:Measurement[]):number
	{
		var value:number = 0;
		measurements.forEach(m=>value += m.toUnits(type));
		return value;
	}

	toUnits(toType:UnitType):number
	{
		var _ = this;
		return Measurement.convert(_.value,_.units,toType);
	}

	convertTo(newType:UnitType):Measurement
	{
		return new Measurement(this.toUnits(newType), newType);
	}

	static convert(value:number, fromType:UnitType, toType:UnitType):number
	{
		while(fromType!=toType)
		{
			switch(fromType)
			{
				case UnitType.Miles:

					switch(toType)
					{
						case UnitType.Kilometers:
							value /= Measurement.MILESPERKILOMETER;
							fromType = UnitType.Kilometers;
							break;

						default:
							value *= Measurement.FEETPERMILE;
							fromType = UnitType.Feet;
							break;

					}
					break;


				case UnitType.Feet:

					switch(toType)
					{
						// Convert...
						case UnitType.Meters:
							value /= Measurement.FEETPERMETER;
							fromType = UnitType.Meters;
							break;

						// Upscale...
						case UnitType.Kilometers:
						case UnitType.Miles:
							value /= Measurement.FEETPERMILE;
							fromType = UnitType.Miles;
							break;

						// Downscale...
						default:
							value *= Measurement.INCHESPERFEET;
							fromType = UnitType.Inches;
							break;

					}
					break;


				case UnitType.Kilometers:

					switch(toType)
					{
						// Convert...
						case UnitType.Miles:
							value *= Measurement.MILESPERKILOMETER;
							fromType = UnitType.Miles;
							break;

						// Downscale...
						default:
							value *= 1000;
							fromType = UnitType.Meters;
							break;
					}

					break;


				case UnitType.Meters:

					switch(toType)
					{
						// Convert...
						case UnitType.Feet:
							value *= Measurement.FEETPERMETER;
							fromType = UnitType.Feet;
							break;

						// Upscale...
						case UnitType.Kilometers:
						case UnitType.Miles:
							value /= 1000;
							fromType = UnitType.Kilometers;
							break;

						// Downscale...
						default:
							value *= 100;
							fromType = UnitType.Centimeters;
							break;

					}
					break;


				// Upscale...
				case UnitType.Millimeters:
					value /= 10;
					fromType = UnitType.Centimeters;
					break;


				case UnitType.Inches:

					switch(toType)
					{
						// Convert...
						case UnitType.Centimeters:
						case UnitType.Millimeters:
							value /= Measurement.INCHESPERCENTIMETER;
							fromType = UnitType.Centimeters;
							break;

						// Upscale...
						default:
							value /= Measurement.INCHESPERFEET;
							fromType = UnitType.Feet;
							break;
					}

					break;

				case UnitType.Centimeters:
					switch(toType)
					{
						// Convert...
						case UnitType.Inches:
							value *= Measurement.INCHESPERCENTIMETER;
							fromType = UnitType.Inches;
							break;

						// Downscale...
						case UnitType.Millimeters:
							value *= 10;
							fromType = UnitType.Millimeters;
							break;

						// Upscale...
						default:
							value /= 100;
							fromType = UnitType.Meters;
							break;
					}
					break;

			}
		}

		return value;
	}

	get inches() {
		return this.toUnits(UnitType.Inches);
	}

	get feet() {
		return this.toUnits(UnitType.Feet);
	}

	get miles() {
		return this.toUnits(UnitType.Miles);
	}

	get meters() {
		return this.toUnits(UnitType.Meters);
	}
}


export = Measurement;
