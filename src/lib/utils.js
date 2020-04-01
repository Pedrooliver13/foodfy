module.exports = {
  date(timestap) {
    const data = new Date(timestap);

    const year = data.getUTCFullYear();

    const month = `0${data.getUTCMonth() + 1}`.slice(-2);

    const day = `0${data.getUTCDate()}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
      birthDate: `${day}/${month}/${year}`
    };
  }
};
