import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import ToggleMulti from "../ToggleMulti.vue";

const items = ["One", "Two", "Three"];

describe("ToggleMulti", () => {
  it("renders properly", () => {
    const wrapper = mount(ToggleMulti, { propsData: { items } });

    for (const item of items) {
      expect(wrapper.text()).toContain(item);
    }
  });

  it("sets all items active on mount", () => {
    const wrapper = mount(ToggleMulti, { propsData: { items } });

    expect(wrapper.vm.active).toEqual(items);
  });

  it("sets all items active on prop change", async () => {
    const wrapper = mount(ToggleMulti, { propsData: { items } });

    expect(wrapper.vm.active).toEqual(items);

    const dummyItems = ["Something"]

    await wrapper.setProps({
      items: dummyItems
    })

    expect(wrapper.vm.active).toEqual(dummyItems);
  })

  it("triggers toggle event properly", async () => {
    const wrapper = mount(ToggleMulti, { propsData: { items } });

    const expectedResult = ["One", "Three"];

    const [, secondItem] = items;

    const secondItemButton = wrapper
      .findAll("button")
      .filter((item) => item.text() === `${secondItem} YRS`)
      .at(0);

    await secondItemButton.trigger("click");

    expect(wrapper.emitted().toggle).toBeTruthy();
    expect(wrapper.emitted().toggle[0]).toEqual([expectedResult]);

    expect(wrapper.vm.active).toEqual(expectedResult);

    await secondItemButton.trigger("click");

    expect(wrapper.emitted().toggle).toBeTruthy();
    expect(wrapper.emitted().toggle[1]).toEqual([
      [...expectedResult, secondItem],
    ]);

    expect(wrapper.vm.active).toEqual([...expectedResult, secondItem]);
  });
});
