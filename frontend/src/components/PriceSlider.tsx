import { Slider } from "@heroui/react";
import { useState } from "react";

function PriceSlider({
  setFilterPrice,
  maxPrice,
  defaultPrice = [0, 0],
  isDisabled = false,
}: {
  maxPrice: number;
  defaultPrice: number[];
  setFilterPrice: (price: number[]) => void;
  isDisabled?: boolean;
}) {
  const [price, setPrice] = useState<number | number[]>(
    defaultPrice || [0, 100_000],
  );

  return (
    <Slider
      aria-label="Price"
      className="w-full"
      value={price}
      onChange={(value) => setPrice(value)}
      onChangeEnd={(value) =>
        typeof value === "number" ? undefined : setFilterPrice(value)
      }
      formatOptions={{
        currency: "INR",
        style: "currency",
        maximumFractionDigits: 0,
      }}
      minValue={0}
      maxValue={maxPrice}
      isDisabled={isDisabled}
      step={1}
    >
      <div className="flex flex-col">
        <span className="label font-huninn uppercase text-muted text-base mb-2">
          Price
        </span>
        <Slider.Track className="w-full border-x-0 h-2 bg-accent-soft">
          {({ state }) => (
            <>
              <Slider.Fill />
              {state.values.map((_, i) => (
                <Slider.Thumb
                  className="size-4 after:rounded-full after:border after:border-accent bg-transparent"
                  key={i}
                  index={i}
                />
              ))}
            </>
          )}
        </Slider.Track>
        <Slider.Output className="flex justify-between w-full">
          {({ state }) =>
            state.values.map((_, i) => (
              <span className="font-light text-sm mt-2" key={i}>
                {state.getThumbValueLabel(i)}
              </span>
            ))
          }
        </Slider.Output>
      </div>
    </Slider>
  );
}

export default PriceSlider;
