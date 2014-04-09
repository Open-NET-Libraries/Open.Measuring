using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Open.Measuring
{
	public struct Measurement
	{
		public UnitType Units;
		public double Value;

		public const double FEETPERMILE = 5280;
		public const double INCHESPERFEET = 12;
		public const double MILESPERKILOMETER = 0.62137;
		public const double FEETPERMETER = 3.2808;
		public const double INCHESPERCENTIMETER = 0.39370;

		public Measurement MultiplyBy(double ratio)
		{
			return new Measurement
			{
				Units = Units,
				Value = Value * ratio
			};
		}

		public Measurement ToUnits(UnitType newType)
		{
			var type = Units;
			var value = Value;

			while(type!=newType)
			{
				switch(type)
				{
					case UnitType.Miles:

						switch(newType)
						{
							case UnitType.Kilometers:
								value /= MILESPERKILOMETER;
								type = UnitType.Kilometers;
								break;

							default:
								value /= FEETPERMILE;
								type = UnitType.Inches;
								break;

						}
						break;


					case UnitType.Feet:

						switch(newType)
						{
							// Convert...
							case UnitType.Meters:
								value /= FEETPERMETER;
								type = UnitType.Meters;
								break;

							// Upscale...
							case UnitType.Kilometers:
							case UnitType.Miles:
								value *= FEETPERMILE;
								type = UnitType.Miles;
								break;

							// Downscale...
							default:
								value /= INCHESPERFEET;
								type = UnitType.Inches;
								break;

						}
						break;


					case UnitType.Kilometers:

						switch(newType)
						{
							// Convert...
							case UnitType.Miles:
								value *= MILESPERKILOMETER;
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

						switch(newType)
						{
							// Convert...
							case UnitType.Feet:
								value /= FEETPERMETER;
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

						switch (newType)
						{
							// Convert...
							case UnitType.Centimeters:
							case UnitType.Millimeters:
								value *= INCHESPERCENTIMETER;
								type = UnitType.Centimeters;
								break;

							// Upscale...
							default:
								value *= INCHESPERFEET;
								type = UnitType.Feet;
								break;
						}

						break;

					case UnitType.Centimeters:
						switch (newType)
						{
							// Convert...
							case UnitType.Inches:
								value /= INCHESPERCENTIMETER;
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

			return new Measurement
			{
				Units = newType,
				Value = value
			};
		}
	}
}
