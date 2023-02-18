import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import ToggleSingle from "../ToggleSingle.vue";

const items = ["One", "Two", "Three"];

describe("ToggleSingle", () => {
  it("renders properly", () => {
    const wrapper = mount(ToggleSingle, { propsData: { items } });

    for (const item of items) {
      expect(wrapper.text()).toContain(item);
    }
  });

  it("sets the first item active on mount", () => {
    const wrapper = mount(ToggleSingle, { propsData: { items } });

    const [firstItem] = items;

    expect(wrapper.vm.active).toEqual(firstItem);
  });

  it("triggers toggle event properly", async () => {
    const wrapper = mount(ToggleSingle, { propsData: { items } });

    const [, secondItem] = items;

    const secondItemButton = wrapper
      .findAll("button")
      .filter((item) => item.text() === secondItem)
      .at(0);

    await secondItemButton.trigger("click");

    expect(wrapper.emitted().toggle).toBeTruthy();
    expect(wrapper.emitted().toggle[0]).toEqual([secondItem]);

    expect(wrapper.vm.active).toEqual(secondItem);
  });
});
