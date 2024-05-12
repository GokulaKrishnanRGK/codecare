import { http, HttpResponse } from "msw";

function getQueryParam(url: string, key: string): string | null {
  const u = new URL(url, "http://localhost");
  return u.searchParams.get(key);
}

export const handlers = [
  http.get(/\/api\/admin\/vaccinations.*/i, ({ request }) => {
    const page = Number(getQueryParam(request.url, "page") ?? "1");
    const pageSize = 10;

    const all = [
      { id: "v1", name: "Hepatitis B", description: "HepB vaccine description" },
      { id: "v2", name: "Tetanus", description: "Tetanus vaccine description" },
    ];

    const items = all.slice((page - 1) * pageSize, page * pageSize);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return HttpResponse.json({
      status: 200,
      data: { items, page, pageSize, total, totalPages },
    });
  }),

  http.post(/\/api\/admin\/vaccinations$/i, async ({ request }) => {
    const body = (await request.json()) as { name?: string; description?: string };

    if (!body?.name?.trim() || !body?.description?.trim()) {
      return HttpResponse.json(
          {
            error: {
              message: "Invalid vaccination data",
              details: { name: ["Required"], description: ["Required"] },
            },
          },
          { status: 400 }
      );
    }

    return HttpResponse.json({
      status: 200,
      data: {
        id: "new-id",
        name: body.name.trim(),
        description: body.description.trim(),
      },
    });
  }),

  http.put(/\/api\/admin\/vaccinations\/([^/]+)$/i, async ({ request }) => {
    const body = (await request.json()) as { name?: string; description?: string };

    if (!body?.name?.trim() || !body?.description?.trim()) {
      return HttpResponse.json(
          {
            error: {
              message: "Invalid vaccination data",
              details: { name: ["Required"], description: ["Required"] },
            },
          },
          { status: 400 }
      );
    }

    return HttpResponse.json({
      status: 200,
      data: {
        id: "updated-id",
        name: body.name.trim(),
        description: body.description.trim(),
      },
    });
  }),

  http.get(/\/api\/events$/i, () => {
    return HttpResponse.json({
      status: 200,
      data: { items: [], page: 1, pageSize: 5, total: 0, totalPages: 1 },
    });
  }),

  http.get(/\/api\/events\/([^/]+)$/i, ({ params }) => {
    const id = String(params[0]);

    return HttpResponse.json({
      status: 200,
      data: {
        id,
        type: "Blood Donation Camp",
        title: "Sample Event",
        organizer: "Org",
        description: "Description",
        date: new Date(Date.now() + 86400000).toISOString(),
        contactInfo: "1234567890",
        eventImage: "events/sample.png",
        location: {
          address: "Addr",
          city: "City",
          state: "State",
          country: "USA",
          postalCode: "12345",
        },
        registeredCount: 2,
        attendedCount: 0,
        isRegistered: false,
      },
    });
  }),

  http.post(/\/api\/events\/([^/]+)\/register$/i, () => {
    return HttpResponse.json({ status: 200, data: { ok: true } });
  }),

  http.post(/\/api\/events\/([^/]+)\/unregister$/i, () => {
    return HttpResponse.json({ status: 200, data: { ok: true } });
  }),
];
