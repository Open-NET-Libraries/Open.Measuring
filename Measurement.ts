
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

	public static product(type:UnitType,measurements:Measurement[]):number
	{
		if(!measurements.length)
			return NaN;
		var value:number = 1;
		measurements.forEach(m=>value *= m.toUnits(type));
		return value;
	}

	public static sum(type:UnitType,measurements:Measurement[]):number
	{
		var value:number = 0;
		measurements.forEach(m=>value += m.toUnits(type));
		return value;
	}

	toUnits(units:UnitType):number
	{
		var _ = this;
		var type = _.units;
		var value = _.value;

		while(type!=units)
		{
			switch(type)
			{
				case UnitType.Miles:

					switch(units)
					{
						case UnitType.Kilometers:
							value /= Measurement.MILESPERKILOMETER;
							type = UnitType.Kilometers;
							break;

						default:
							value /= Measurement.FEETPERMILE;
							type = UnitType.Inches;
							break;

					}
					break;


				case UnitType.Feet:

					switch(units)
					{
						// Convert...
						case UnitType.Meters:
							value /= Measurement.FEETPERMETER;
							type = UnitType.Meters;
							break;

						// Upscale...
						case UnitType.Kilometers:
						case UnitType.Miles:
							value *= Measurement.FEETPERMILE;
							type = UnitType.Miles;
							break;

						// Downscale...
						default:
							value /= Measurement.INCHESPERFEET;
							type = UnitType.Inches;
							break;

					}
					break;


				case UnitType.Kilometers:

					switch(units)
					{
						// Convert...
						case UnitType.Miles:
							value *= Measurement.MILESPERKILOMETER;
							type = UnitType.Miles;
							break;

						// Downscale...
						default:
							value *= 1000;
							type = UnitType.Meters;
							break;
					}

					break;


				case UnitType.Meters:

					switch(units)
					{
						// Convert...
						case UnitType.Feet:
							value /= Measurement.FEETPERMETER;
							type = UnitType.Meters;
							break;

						// Upscale...
						case UnitType.Kilometers:
						case UnitType.Miles:
							value /= 1000;
							type = UnitType.Kilometers;
							break;

						// Downscale...
						default:
							value *= 100;
							type = UnitType.Centimeters;
							break;

					}
					break;


				// Upscale...
				case UnitType.Millimeters:
					value /= 10;
					type = UnitType.Centimeters;
					break;


				case UnitType.Inches:

					switch (units)
					{
						// Convert...
						case UnitType.Centimeters:
						case UnitType.Millimeters:
							value *= Measurement.INCHESPERCENTIMETER;
							type = UnitType.Centimeters;
							break;

						// Upscale...
						default:
							value *= Measurement.INCHESPERFEET;
							type = UnitType.Feet;
							break;
					}

					break;

				case UnitType.Centimeters:
					switch (units)
					{
						// Convert...
						case UnitType.Inches:
							value /= Measurement.INCHESPERCENTIMETER;
							type = UnitType.Inches;
							break;

						// Downscale...
						case UnitType.Millimeters:
							value *= 10;
							type = UnitType.Millimeters;
							break;

						// Upscale...
						default:
							value *= 100;
							type = UnitType.Meters;
							break;
					}
					break;

			}
		}

		return value;
	}

	convertTo(newType:UnitType):Measurement
	{
		return new Measurement(this.toUnits(newType),newType);
	}
}

export = Measurement;
