import { createMachine, assign } from "xstate";

export const counterMachine = createMachine(
  {

    predictableActionArguments: true,

    context: {
      count: 0,
    },
    initial: 'active',
    states: {
      active: {
        on: {
          DEACTIVE: 'deactive',
          INCREMENT: {
            actions: assign({
              count: (context) => context.count + 1,
            }),
          },
          DECREMENT: {
            cond: "isPositive",
            actions: assign({
              count: (context) => context.count - 1
            }),
          }
        },
      },
      deactive: {
        on: {
          ACTIVE: 'active',
          RESET: {
            actions: assign({
              count: 0,
            }),
          }
        }
      }
    }
  },

  {
    guards: {
      isPositive: (context, event) => context.count > 0,
      // isReset: (context, event) => context.count===0
    },

    
  }
);
