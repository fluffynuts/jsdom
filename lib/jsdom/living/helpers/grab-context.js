module.exports = function grabContext(execFuncWithContext) {
  let context = null;
  if (typeof window !== "undefined") {
    context = window;
  } else if (typeof global !== "undefined") {
    context = global;
  }
  const result = execFuncWithContext(context);
  return result;
};
