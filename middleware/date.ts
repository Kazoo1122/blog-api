/**
 * 日時を整形する
 * @param d
 * @returns string
 */
const formatDate = (d: Date) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

/**
 * 10未満の数値を0埋めする
 * @param checkedNum
 * @param isMonth 月の場合は1加算
 * @returns
 */
const zeroFill = (checkedNum: number, isMonth: boolean) => {
  let threshold;
  isMonth ? (threshold = 9) : (threshold = 10);
  return (checkedNum < threshold ? '0' : '') + checkedNum;
};

/**
 * JSON形式で文字列を格納した型
 */
type HashDate = {
  [key: string]: Date;
};

/**
 * sort関数のために日付の大小を比較する
 * @param sortedName
 * @param reversed
 * @returns 1 or -1
 */
const sortWithDate = (sortedName: string, reversed: boolean) => (a: HashDate, b: HashDate) => {
  if (reversed) {
    return a[sortedName] < b[sortedName] ? 1 : -1;
  } else {
    return a[sortedName] > b[sortedName] ? -1 : 1;
  }
};

export { formatDate, sortWithDate };
