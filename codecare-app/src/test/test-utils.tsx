import * as React from "react";
import {Provider} from "react-redux";
import {MemoryRouter} from "react-router-dom";
import {render, type RenderOptions} from "@testing-library/react";

import {store as appStore} from "../store";

type Options = {
  route?: string;
  store?: typeof appStore;
};

function AppProviders({
                        children,
                        route = "/",
                        store = appStore,
                      }: React.PropsWithChildren<Options>) {
  return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
  );
}

export function renderWithProviders(
    ui: React.ReactElement,
    options?: Options & Omit<RenderOptions, "wrapper">
) {
  const {route, store, ...rest} = options ?? {};
  return render(ui, {
    wrapper: ({children}) => (
        <AppProviders route={route} store={store}>
          {children}
        </AppProviders>
    ),
    ...rest,
  });
}

export * from "@testing-library/react";
