# The image is a pure copy of the adapter-staged Compute tree
# (.next/coldbrew/compute — the traced per-function file union plus the
# launcher). The build itself must have run with NEXT_ADAPTER_PATH set;
# there is no `output` mode and no server.js.
FROM gcr.io/distroless/nodejs24-debian13
WORKDIR /app

ENV PORT=3000

COPY --chown=nonroot:nonroot .next/coldbrew/compute ./

# Copy bootstrap script (must exist at project root)
COPY --chown=nonroot:nonroot coldbrew-env-bootstrap.cjs ./coldbrew-env-bootstrap.cjs

EXPOSE 3000

USER nonroot

# Preload bootstrap script before app starts
ENV NODE_OPTIONS="--require /app/coldbrew-env-bootstrap.cjs"
CMD ["coldbrew-launcher/main.cjs"]
