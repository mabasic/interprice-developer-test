import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InterPriceComponent, {
  extractCurrencies,
  extractYears,
} from "../InterPriceComponent.vue";
import { SPREAD, YIELD } from "../../constants/Display";
import JSONDATA from "../../data.json";
import ToggleMulti from "../../components/ToggleMulti.vue";
import ToggleSingle from "../../components/ToggleSingle.vue";

describe("InterPriceComponent", () => {
  it("renders properly", () => {
    const wrapper = mount(InterPriceComponent, {
      propsData: { items: JSONDATA },
    });

    expect(wrapper).toBeTruthy();
  });

  it("updates the companyFilter on text input", async () => {
    const wrapper = mount(InterPriceComponent, {
      propsData: { items: JSONDATA },
    });

    expect(wrapper.vm.companyFilter).toEqual("");

    const companyFilterInput = wrapper.find('input[type="text"]');
    await companyFilterInput.setValue("test");

    expect(wrapper.vm.companyFilter).toEqual("test");
  });

  it("handles years change event", async () => {
    const wrapper = mount(InterPriceComponent, {
      propsData: { items: JSONDATA },
    });

    const yearsToggle = wrapper.getComponent(ToggleMulti);

    const secondItemButton = yearsToggle
      .findAll("button")
      .filter((item) => item.text() === "10 YRS")
      .at(0);

    await secondItemButton.trigger("click");

    expect(wrapper.vm.selectedYears).toEqual([5, 40]);
  });

  it("handles currency change event", async () => {
    const wrapper = mount(InterPriceComponent, {
      propsData: { items: JSONDATA },
    });

    const currencyToggle = wrapper.findAllComponents(ToggleSingle).at(0);

    const [firstCurrency, secondCurrency] = wrapper.vm.currencies;

    expect(wrapper.vm.selectedCurrency).toEqual(firstCurrency);

    const secondItemButton = currencyToggle
      .findAll("button")
      .filter((item) => item.text() === secondCurrency)
      .at(0);

    await secondItemButton.trigger("click");

    expect(wrapper.vm.selectedCurrency).toEqual(secondCurrency);
  });

  it("handles display change event", async () => {
    const wrapper = mount(InterPriceComponent, {
      propsData: { items: JSONDATA },
    });

    const displayToggle = wrapper.findAllComponents(ToggleSingle).at(1);

    expect(wrapper.vm.selectedDisplay).toEqual(SPREAD);

    const secondItemButton = displayToggle
      .findAll("button")
      .filter((item) => item.text() === YIELD)
      .at(0);

    await secondItemButton.trigger("click");

    expect(wrapper.vm.selectedDisplay).toEqual(YIELD);
  });

  it("returns computed years", () => {
    const wrapper = mount(InterPriceComponent, {
      propsData: { items: JSONDATA },
    });

    expect(wrapper.vm.years).toEqual([5, 10, 40]);
  });
});

describe("extractYears", () => {
  it("returns years from the json file", () => {
    const years = extractYears(JSONDATA, "USD");

    expect(years).toEqual([5, 10, 40]);
  });
});

describe("extractCurrencies", () => {
  it("returns currencies from the json file", () => {
    const currencies = extractCurrencies(JSONDATA);

    expect(currencies).toEqual(["USD", "EUR", "CAD"]);
  });
});
