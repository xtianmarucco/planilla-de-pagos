export const success = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

export const paginated = (res, data, meta) =>
  res.status(200).json({ success: true, data, meta });
