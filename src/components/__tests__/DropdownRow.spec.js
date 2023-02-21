import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import DropdownRow from "../DropdownRow.vue";
import { FIX, FRN } from "../../constants/CouponType";
import { SPREAD, YIELD, THREE_ML_SPREAD } from "../../constants/Display";
import JSONDATA from "../../data.json";

const props = {
  item: JSONDATA.Items[0],
  selectedYears: [5],
  selectedDisplay: SPREAD,
  selectedCurrency: "USD",
  minimumValues: {
    5: {
      FIX: "+50bp",
      FRN: null,
    },
  },
};

describe("DropdownRow", () => {
  it("renders properly", () => {
    const wrapper = mount(DropdownRow, { propsData: props });

    expect(wrapper.text()).toContain(props.item.Company);
  });

  it("expands the primary row", async () => {
    const wrapper = mount(DropdownRow, { propsData: props });

    await wrapper.get("button").trigger("click");

    expect(wrapper.vm.expanded).toEqual(true);

    await wrapper.get("button").trigger("click");

    expect(wrapper.vm.expanded).toEqual(false);
  });

  it("returns other displays", () => {
    const wrapper = mount(DropdownRow, {
      propsData: {
        ...props,
        selectedDisplay: SPREAD,
      },
    });

    expect(wrapper.vm.otherDisplays).toEqual([YIELD, THREE_ML_SPREAD]);
  });

  it("tests the isMinimum method", () => {
    const wrapper = mount(DropdownRow, { propsData: props });

    expect(wrapper.vm.isMinimum("+50bp", "5", FIX)).toEqual(true);
    expect(wrapper.vm.isMinimum("+50bp", "5", FRN)).toEqual(false);
  });

  it("tests the getQuoteValue method", () => {
    const wrapper = mount(DropdownRow, {
      propsData: {
        ...props,
        selectedDisplay: SPREAD,
      },
    });

    expect(wrapper.vm.getQuoteValue(5, FIX)).toEqual("+50bp");
    expect(wrapper.vm.getQuoteValue(5, FIX, YIELD)).toEqual("0.873%");
  });

  it("tests the getQuoteValues method", () => {
    const wrapper = mount(DropdownRow, {
      propsData: {
        ...props,
        selectedYears: [10],
        selectedDisplay: SPREAD,
        selectedCurrency: "USD",
        item: JSONDATA.Items[1],
        minimumValues: {
          10: {
            FIX: "+75bp",
            FRN: null,
          },
        },
      },
    });

    expect(wrapper.vm.getQuoteValues()).toEqual({
      10: {
        FIX: "+75bp",
        FRN: "",
      },
    });
    expect(wrapper.vm.getQuoteValues(YIELD)).toEqual({
      10: {
        FIX: "1.678%",
        FRN: "",
      },
    });
  });
});
