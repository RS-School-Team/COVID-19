class Icons {
  constructor(arrayOfIcons) {
    this.reassign(arrayOfIcons);
  }

  reassign(iconsArray) {
    const [iconsNames, iconBody] = iconsArray;
    this.icons = iconsNames.map((address, index) => {
      const [fileName] = address.split('/').reverse();
      const [name] = fileName.split('.');
      return { name, svg: iconBody[index] };
    });
  }

  getIcon(name) {
    const { svg } = this.icons.find(iconObject => iconObject.name === name.toString());
    return svg;
  }
}

export default Icons;
