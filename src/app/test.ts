// this file is only being used by karma

(<any>window).game = {};

const testsContext: any = (<any>require).context('.', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);