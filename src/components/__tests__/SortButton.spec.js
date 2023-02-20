import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import SortButton from "../SortButton.vue";
import { ASC, DESC } from "../../constants/SortDirection";
import { DATE_SENT, COMPANY } from "../../constants/SortColumn";

const props = {
  sortColumn: DATE_SENT,
  sortDirection: DESC,
  column: DATE_SENT,
  label: "Test",
};

describe("SortButton", () => {
  it("renders properly", () => {
    const wrapper = mount(SortButton, { propsData: props });

    expect(wrapper.text()).toContain(props.label);
  });

  it("triggers sort direction update event", async () => {
    const wrapper = mount(SortButton, {
      propsData: {
        ...props,
        sortDirection: DESC,
      },
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted()["update:sortDirection"]).toBeTruthy();
    expect(wrapper.emitted()["update:sortDirection"][0]).toEqual([ASC]);

    await wrapper.setProps({
      sortDirection: ASC,
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted()["update:sortDirection"]).toBeTruthy();
    expect(wrapper.emitted()["update:sortDirection"][1]).toEqual([DESC]);
  });

  it("triggers sort column update event on sort direction change", async () => {
    const wrapper = mount(SortButton, {
      propsData: {
        ...props,
        sortDirection: DESC,
        sortColumn: DATE_SENT,
        column: COMPANY,
      },
    });

    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted()["update:sortDirection"]).toBeTruthy();
    expect(wrapper.emitted()["update:sortDirection"][0]).toEqual([DESC]);
    expect(wrapper.emitted()["update:sortColumn"]).toBeTruthy();
    expect(wrapper.emitted()["update:sortColumn"][0]).toEqual([COMPANY]);
  });
});
