import { expect, Locator, Page } from "@playwright/test";
import * as inputData from "../test-data/input.json";
import { link } from "fs";

export class CommonPage {
  readonly page: Page;
  readonly inputText: Locator;
  readonly todoList: Locator;
  readonly pageTextDoubleClick: Locator;
  readonly pageTextCreatedby: Locator;
  readonly pageTextPartof: Locator;
  readonly toDoLable: Locator;
  readonly toDoToggle: Locator;
  readonly task: Locator;
  readonly clearComplete: Locator;
  readonly delete: Locator;
  readonly toggleAll: Locator;
  readonly todoItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputText = page.getByPlaceholder("What needs to be done?");
    this.todoList = page.getByTestId("todo-list");
    this.pageTextDoubleClick = page.getByText(inputData.infoText.DoubleClick);
    this.pageTextCreatedby = page.getByText(inputData.infoText.CreatedBy);
    this.pageTextPartof = page.getByText(inputData.infoText.PartOf);
    this.toDoLable = page.getByTestId("todo-item-label");
    this.toDoToggle = page.getByTestId("todo-item-toggle");
    this.clearComplete = page.getByRole("button", { name: "Clear completed" });
    this.delete = page.getByRole("button", { name: "×" });
    this.toggleAll = page.getByTestId("toggle-all");
    this.todoItem = page.getByTestId('todo-item')
  }

  /* All the action methods used for the test start here. */

  async enterTodoList(text: string) {
    await this.inputText.fill(text);
    await this.inputText.press("Enter");
    await expect(this.inputText).toBeEmpty();
  }

  async checkTodoTask(taskName: string) {
    await this.page
      .locator("div")
      .filter({ hasText: taskName })
      .getByTestId("todo-item-toggle")
      .check();
  }

  async uncheckTodoTask(taskName: string) {
    await this.page
      .locator("div")
      .filter({ hasText: taskName })
      .getByTestId("todo-item-toggle")
      .uncheck();
  }

  async checkToggleAll() {
    await this.toggleAll.check();
  }

  async clickOnButtonState(buttonStateName: string) {
    await this.page.getByRole("link", { name: buttonStateName }).click();
  }

  async clickOnClrComButton() {
    await this.clearComplete.click();
  }

  async deleteFirstTask() {
    await this.delete.first().click();
  }

  /* All the test assertion methods used for the test start here. */

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/TodoMVC/);
  }

  async verifyPageText() {
    await expect(this.pageTextDoubleClick).toBeVisible();
    await expect(this.pageTextCreatedby).toBeVisible();
    await expect(this.pageTextPartof).toBeVisible();
  }

  async verifyAddedTask(text: string) {
    await expect(this.todoList).toHaveText(text);
  }

  async verifyAllListCount() {
    const listCount = await this.toDoLable.count();
    if (listCount === 1) {
      await expect(
        this.page.getByText(`${listCount} item left!`)
      ).toBeVisible();
    } else {
      await expect(
        this.page.getByText(`${listCount} items left!`)
      ).toBeVisible();
    }
  }

  async verifyCheckbox(task: string) {
    await expect(
      this.page
        .locator("div")
        .filter({ hasText: task })
        .getByTestId("todo-item-toggle")
    ).toBeChecked();
  }

  async verifyItemleft() {
    const completed = await this.page
      .locator(".completed")
      .getByTestId("todo-item-label")
      .count();
    const listCount = await this.toDoLable.count();
    const remaining = listCount - completed;

    if (remaining === 1) {
      await expect(
        this.page.getByText(`${remaining} item left!`)
      ).toBeVisible();
    } else {
      await expect(
        this.page.getByText(`${remaining} items left!`)
      ).toBeVisible();
    }
  }

  async verifyCompletedButton() {
    await expect(
      this.page.getByText(inputData.list.Execution)
    ).not.toBeVisible();
    await expect(
      this.page.getByText(inputData.list.Reporting)
    ).not.toBeVisible();
    await expect(
      this.page.getByText(inputData.list.Retesting)
    ).not.toBeVisible();
  }

  async verifyActiveButton() {
    await expect(
      this.page.getByText(inputData.list.Creation)
    ).not.toBeVisible();
  }

  async verifyALLButton() {
    await expect(this.page.getByText(inputData.list.Creation)).toBeVisible();
    await expect(this.page.getByText(inputData.list.Execution)).toBeVisible();
    await expect(this.page.getByText(inputData.list.Reporting)).toBeVisible();
    await expect(this.page.getByText(inputData.list.Retesting)).toBeVisible();
  }

  async verifyClearComplteButton() {
    await expect(
      this.page.getByText(inputData.list.Creation)
    ).not.toBeVisible();
  }

  async verifyAfterDelete() {
    await expect(
      this.page.getByText(inputData.list.Execution)
    ).not.toBeVisible();
  }

  async verifyTaskComplete(){
    await expect(this.todoItem.first()).toHaveClass('completed');
  }
}