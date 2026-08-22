export const toJSONOptions = {
  // virtuals must be on or the id getter is left out of the JSON.
  virtuals: true,
  transform(_doc: unknown, ret: Record<string, unknown>) {
    const { _id, __v, password, ...rest } = ret;
    return rest;
  },
};
