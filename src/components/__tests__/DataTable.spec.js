import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DataTable, {
  extractItemsWithNoQuote,
  extractItemsWithQuote,
  filterByCompanyFilter,
  parseDateSentToDate,
  formatDateSent,
  toLowerCaseIfString,
  sortItemsBy,
} from "../../components/DataTable.vue";
import DISPLAYS, { SPREAD } from "../../constants/Display";
import { DESC, ASC } from "../../constants/SortDirection";
import { COMPANY, DATE_SENT } from "../../constants/SortColumn";
import SortButton from "../../components/SortButton.vue";
import JSONDATA from "../../data.json";
import { FIX, FRN } from "../../constants/CouponType";

const props = {
  items: JSONDATA.Items,
  companyFilter: "",
  selectedYears: [5, 10, 40],
  selectedDisplay: SPREAD,
  displays: DISPLAYS,
  selectedCurrency: "USD",
};

describe("DataTable", () => {
  it("renders properly", () => {
    const wrapper = mount(DataTable, { propsData: props });

    expect(wrapper.text()).toContain("Average by Spread");
  });

  it("tests the getAverageQuoteValue method", () => {
    const wrapper = mount(DataTable, { propsData: props });

    expect(wrapper.vm.getAverageQuoteValue(10, FIX)).toEqual("+88bp");
    expect(wrapper.vm.getAverageQuoteValue(5, FRN)).toEqual(0);
  });

  it("changes sort direction of the currect sort column", async () => {
    const wrapper = mount(DataTable, { propsData: props });

    const dateSentSortColumn = wrapper.findAllComponents(SortButton).at(0);

    expect(wrapper.vm.sortDirection).toEqual(DESC);

    await dateSentSortColumn.get("button").trigger("click");

    expect(wrapper.vm.sortDirection).toEqual(ASC);
  });

  it("displays only selected years", async () => {
    const wrapper = mount(DataTable, { propsData: props });

    expect(wrapper.vm.selectedYears).toEqual([5, 10, 40]);
    expect(wrapper.text()).toContain("40 YRS");

    await wrapper.setProps({
      selectedYears: [5, 10],
    });

    expect(wrapper.text()).not.toContain("40 YRS");
  });

  it("changes sort column", async () => {
    const wrapper = mount(DataTable, { propsData: props });

    const companySortColumn = wrapper.findAllComponents(SortButton).at(1);

    expect(wrapper.vm.sortDirection).toEqual(DESC);
    expect(wrapper.vm.sortColumn).toEqual(DATE_SENT);

    await companySortColumn.get("button").trigger("click");

    expect(wrapper.vm.sortDirection).toEqual(DESC);
    expect(wrapper.vm.sortColumn).toEqual(COMPANY);
  });

  it("returns computed quoteItems", () => {
    const wrapper = mount(DataTable, { propsData: props });

    expect(wrapper.vm.quoteItems).toEqual([
      {
        Id: "395356",
        DateSent: "30-Dec-20",
        Company: "Openlane",
        Preferred: "1",
        Quote: [
          {
            Amount: 500,
            Currency: "USD",
            Years: 5,
            CouponType: "FIX",
            Spread: 50,
            Yield: 0.873,
            "3MLSpread": 86,
          },
          {
            Amount: 500,
            Currency: "CAD",
            Years: 10,
            CouponType: "FIX",
            Spread: 50,
            Yield: 1.209,
            "3MLSpread": 13,
          },
          {
            Amount: 500,
            Currency: "EUR",
            Years: 4,
            CouponType: "FIX",
            Spread: 35,
            Yield: -0.136,
            "3MLSpread": 49,
          },
          {
            Amount: 500,
            Currency: "EUR",
            Years: 8,
            CouponType: "FIX",
            Spread: 60,
            Yield: 0.248,
            "3MLSpread": 81,
          },
          {
            Amount: 500,
            Currency: "EUR",
            Years: 12,
            CouponType: "FIX",
            Spread: 90,
            Yield: 0.721,
            "3MLSpread": 117,
          },
          {
            Amount: 500,
            Currency: "USD",
            Years: 10,
            CouponType: "FIX",
            Spread: 90,
            Yield: 1.828,
            "3MLSpread": 88,
          },
          {
            Amount: 500,
            Currency: "USD",
            Years: 40,
            CouponType: "FIX",
            Spread: 130,
            Yield: 2.965,
            "3MLSpread": 152,
          },
          {
            Amount: 500,
            Currency: "EUR",
            Years: 12,
            CouponType: "FRN",
            Spread: 92,
            Yield: 0.718,
            "3MLSpread": 112,
          },
          {
            Amount: 500,
            Currency: "USD",
            Years: 10,
            CouponType: "FRN",
            Spread: 94,
            Yield: 1.826,
            "3MLSpread": 86,
          },
          {
            Amount: 500,
            Currency: "USD",
            Years: 40,
            CouponType: "FRN",
            Spread: 128,
            Yield: 2.962,
            "3MLSpread": 150,
          },
        ],
      },
      {
        Id: "395347",
        DateSent: "30-Dec-20",
        Company: "Yearin",
        Preferred: "0",
        Quote: [
          {
            Amount: 500,
            Currency: "USD",
            Years: 10,
            CouponType: "FIX",
            Spread: 75,
            Yield: 1.678,
            "3MLSpread": 74,
          },
        ],
      },
      {
        Id: "395284",
        DateSent: "18-Dec-20",
        Company: "Condax",
        Preferred: "0",
        Quote: [
          {
            Amount: 300,
            Currency: "USD",
            Years: 10,
            CouponType: "FIX",
            Spread: 100,
            Yield: null,
            "3MLSpread": null,
          },
        ],
      },
    ]);
  });

  it("returns computed noQuoteItems", () => {
    const wrapper = mount(DataTable, { propsData: props });

    expect(wrapper.vm.noQuoteItems).toEqual([
      {
        Id: null,
        DateSent: "",
        Company: "Opentech",
        Preferred: "1",
        Quote: null,
      },
      {
        Id: null,
        DateSent: "",
        Company: "Golddex",
        Preferred: "1",
        Quote: null,
      },
      {
        Id: null,
        DateSent: "",
        Company: "Warephase",
        Preferred: "1",
        Quote: null,
      },
      {
        Id: null,
        DateSent: "",
        Company: "Donware",
        Preferred: "1",
        Quote: null,
      },
      {
        Id: null,
        DateSent: "",
        Company: "Faxquote",
        Preferred: "1",
        Quote: null,
      },
    ]);
  });

  it("returns computed minimumValuesByYearAndCouponType", () => {
    const wrapper = mount(DataTable, { propsData: props });

    expect(wrapper.vm.minimumValuesByYearAndCouponType).toEqual({
      5: { FIX: "+50bp", FRN: null },
      10: { FIX: "+75bp", FRN: "+94bp" },
      40: { FIX: "+130bp", FRN: "+128bp" },
    });
  });
});

describe("extractItemsWithNoQuote", () => {
  it("returns items with no quote", () => {
    expect(
      extractItemsWithNoQuote([
        {
          Company: "ENCOM",
          Quote: [{}],
        },
        {
          Company: "TRON",
          Quote: null,
        },
      ])
    ).toEqual([
      {
        Company: "TRON",
        Quote: null,
      },
    ]);
  });
});

describe("extractItemsWithQuote", () => {
  it("returns items with quote", () => {
    expect(
      extractItemsWithQuote([
        {
          Company: "ENCOM",
          Quote: [{}],
        },
        {
          Company: "TRON",
          Quote: null,
        },
      ])
    ).toEqual([
      {
        Company: "ENCOM",
        Quote: [{}],
      },
    ]);
  });
});

describe("filterByCompanyFilter", () => {
  it("returns data which contains company filter query", () => {
    expect(
      filterByCompanyFilter(
        [
          {
            Company: "ENCOM",
          },
        ],
        "en"
      )
    ).toEqual([
      {
        Company: "ENCOM",
      },
    ]);

    expect(
      filterByCompanyFilter(
        [
          {
            Company: "ENCOM",
          },
        ],
        "CO"
      )
    ).toEqual([
      {
        Company: "ENCOM",
      },
    ]);
  });

  it("returns no data", () => {
    expect(
      filterByCompanyFilter(
        [
          {
            Company: "ENCOM",
          },
        ],
        "DE"
      )
    ).toEqual([]);
  });
});

describe("parseDateSentToDate", () => {
  it("returns null when DateSent is null", () => {
    expect(
      parseDateSentToDate([
        {
          DateSent: null,
        },
      ])
    ).toEqual([
      {
        DateSent: null,
      },
    ]);
  });

  it("returns new Date when DateSent is truthy", () => {
    expect(
      parseDateSentToDate([
        {
          DateSent: "2020-12-30",
        },
      ])
    ).toEqual([
      {
        DateSent: new Date("2020-12-30"),
      },
    ]);
  });
});

describe("formatDateSent", () => {
  it("returns empty DateSent property if null", () => {
    expect(
      formatDateSent([
        {
          DateSent: null,
        },
      ])
    ).toEqual([
      {
        DateSent: "",
      },
    ]);
  });

  it("returns DateSent in format DD-MMM-YY", () => {
    expect(
      formatDateSent([
        {
          DateSent: new Date("2020-12-30"),
        },
      ])
    ).toEqual([
      {
        DateSent: "30-Dec-20",
      },
    ]);
  });
});

describe("toLowerCaseIfString", () => {
  it("returns lowercase string", () => {
    expect(toLowerCaseIfString("Mario")).toEqual("mario");
  });

  it("returns number", () => {
    expect(toLowerCaseIfString(3)).toEqual(3);
  });
});

describe("sortItemsBy", () => {
  const sampleData = [
    {
      Company: "ACME",
      DateSent: "2020-12-18",
      Preferred: "1",
    },
    {
      Company: "ENCOM",
      DateSent: "2020-12-30",
      Preferred: "0",
    },
    {
      Company: "TRON",
      DateSent: "2020-12-30",
      Preferred: "1",
    },
  ];

  it("returns data without sorting it", () => {
    expect(sortItemsBy(sampleData, DATE_SENT)).toEqual(sampleData);
  });

  it("returns data sorted ascending", () => {
    expect(sortItemsBy(sampleData, DATE_SENT, ASC)).toEqual([
      {
        Company: "ACME",
        DateSent: "2020-12-18",
        Preferred: "1",
      },
      {
        Company: "TRON",
        DateSent: "2020-12-30",
        Preferred: "1",
      },
      {
        Company: "ENCOM",
        DateSent: "2020-12-30",
        Preferred: "0",
      },
    ]);
  });

  it("returns data sorted descending", () => {
    expect(sortItemsBy(sampleData, DATE_SENT, DESC)).toEqual([
      {
        Company: "TRON",
        DateSent: "2020-12-30",
        Preferred: "1",
      },
      {
        Company: "ENCOM",
        DateSent: "2020-12-30",
        Preferred: "0",
      },
      {
        Company: "ACME",
        DateSent: "2020-12-18",
        Preferred: "1",
      },
    ]);
  });
});
