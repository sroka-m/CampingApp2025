module.exports = (then) => {
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day; // approximately
  const year = 365 * day; // approximately
  const now = new Date();
  //   const now = new Date("2025-05-15T18:48:21.396Z");
  //   const then = new Date("2025-05-10T18:48:21.396Z");

  let difference = now - then;
  console.log(difference);

  const time = [{ year }, { month }, { day }];

  let diffDate =
    time
      .map((item, i, a) => {
        let [[unitName, unit]] = Object.entries(item);
        // const units = (difference / unit) | 0;
        let units = Math.trunc(difference / unit);
        // let units = difference / unit; // it will be a fraction that gets truncated to 0 so i need truncate in the same step
        difference -= unit * units;
        if (unitName == "day" && units >= 7) {
          units == 7 ? (units = 1) : (units = Math.trunc(units / 7));
          unitName = "week";
        }
        const maybePlural = units === 1 ? "" : "s";
        // console.log(units);
        return units > 0 ? units + " " + unitName + maybePlural : "";
      })
      .find((a) => a.length !== 0) || "today";
  // let result = outcome.find((a) => a.length !== 0) || "today";
  return diffDate !== "today"
    ? `created ${diffDate} ago`
    : `created ${diffDate}`;
};
