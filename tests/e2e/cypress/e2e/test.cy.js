/// <reference types="cypress" />

describe("Test basic features", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
  });

  it("find cs", () => {
    cy.get("th").should("contain.text", "Counter-Strike 2");
  });

  it("search feature", () => {
    cy.get("input#filled-search").type("Monster{enter}");
    cy.get("table")
      .find("tr")
      .find("th")
      .should("contain.text", "Monster Hunter: World");
  });

  it("nothing found from search", () => {
    cy.get("input#filled-search").clear().type("DoesntExist1241{enter}");
    cy.contains("th", "Game")
      .closest("table")
      .within(() => {
        cy.get("tbody").find("tr").should("have.length", 0);
      });
  });

  it("next page", () => {
    cy.contains("button", "NEXT PAGE").click();
    cy.contains("th", "Game")
      .closest("table")
      .find("th")
      .should(($ths) => {
        const temp = [...$ths].some((th) =>
          th.innerText.trim().startsWith("11.")
        );
        expect(temp).to.be.true;
      });
  });
});
