import * as React from "react";
import {Provider} from "react-redux";
import {MemoryRouter} from "react-router-dom";
import {render, type RenderOptions} from "@testing-library/react";
import {makeTestStore, type TestStore} from "./testStore";

type Options = {
  route?: string;
  store?: TestStore;
};

export function renderWithProviders(
    ui: React.ReactElement,
    options?: Options & Omit<RenderOptions, "wrapper">
) {
  const route = options?.route ?? "/";
  const store = options?.store ?? makeTestStore();
  const {...rest} = options ?? {};

  function Wrapper({children}: React.PropsWithChildren) {
    return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </Provider>
    );
  }

  return {store, ...render(ui, {wrapper: Wrapper, ...rest})};
}

export * from "@testing-library/react";
