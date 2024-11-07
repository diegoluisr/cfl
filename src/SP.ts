export default class SP {
  public id: string = '';
  public name: string = '';

  public getItems: Function = async () => {return []};

  public async items(): Promise<Array<any>> {
    return await this.getItems();
  }
}
