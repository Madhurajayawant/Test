import { test, Page } from "@playwright/test";
import { CommonPage } from "../page-objects/common.page";
import * as inputData from "../test-data/input.json";

test.describe("Todo Assignment", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;
  let commonPage: CommonPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    commonPage = new CommonPage(page);
  });

  test.afterAll(async () => {
    await commonPage.checkToggleAll();
    await commonPage.verifyItemleft();
    await commonPage.clickOnClrComButton();
  });

  test("TC_01 : Verify the feature is available for test", async () => {
    await page.goto("https://todomvc.com/examples/react/dist/");
    await commonPage.verifyPageTitle();
    await commonPage.verifyPageText();
  });

  test("TC_02 : Verify that Todo list Is getting added", async () => {
    await commonPage.enterTodoList(inputData.list.Creation);
    await commonPage.verifyAddedTask(inputData.list.Creation);
    await commonPage.enterTodoList(inputData.list.Execution);
    await commonPage.enterTodoList(inputData.list.Reporting);
    await commonPage.enterTodoList(inputData.list.Retesting);
    await commonPage.verifyAllListCount();
  });

  test("TC_03 : Verify that user can mark an item completed", async () => {
    await commonPage.checkTodoTask(inputData.list.Creation);
    await commonPage.verifyTaskComplete();
    await commonPage.verifyCheckbox(inputData.list.Creation);
    await commonPage.verifyItemleft();
  });

  test("TC_04: Verify the ALL button", async () => {
    await commonPage.clickOnButtonState(inputData.buttonState.All);
    await commonPage.verifyALLButton();
  });

  test("TC_05: Verify the Active button", async () => {
    await commonPage.clickOnButtonState(inputData.buttonState.Active);
    await commonPage.verifyActiveButton();
  });

  test("TC_06: Verify the Completed button", async () => {
    await commonPage.clickOnButtonState(inputData.buttonState.Completed);
    await commonPage.verifyCompletedButton();
  });

  test("TC_07 : Verify the Clear completed button ", async () => {
    await commonPage.clickOnClrComButton();
    await commonPage.verifyClearComplteButton();
    await commonPage.clickOnButtonState("ALL");
    await commonPage.verifyItemleft();
  });
});
