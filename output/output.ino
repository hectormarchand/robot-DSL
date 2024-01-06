
#include <PinChangeInt.h>
#include <PinChangeIntConfig.h>
#include <EEPROM.h>
#define _NAMIKI_MOTOR // for Namiki 22CL-103501PG80:1
#include <fuzzy_table.h>
#include <PID_Beta6.h>
#include <MotorWheel.h>
#include <Omni4WD.h>

// #include <fuzzy_table.h>
// #include <PID_Beta6.h>

/*

                                /
   wheel1                       /   wheel4
   Left                         /   Right


                              power switch

            /                               wheel2   /                       wheel3
   Right    /                       Left

*/

/*
  irqISR(irq1,isr1);
  MotorWheel wheel1(5,4,12,13,&irq1);

  irqISR(irq2,isr2);
  MotorWheel wheel2(6,7,14,15,&irq2);

  irqISR(irq3,isr3);
  MotorWheel wheel3(9,8,16,17,&irq3);

  irqISR(irq4,isr4);
  MotorWheel wheel4(10,11,18,19,&irq4);
*/

irqISR(irq1, isr1);
MotorWheel wheel1(3, 2, 4, 5, &irq1);

irqISR(irq2, isr2);
MotorWheel wheel2(11, 12, 14, 15, &irq2);

irqISR(irq3, isr3);
MotorWheel wheel3(9, 8, 16, 17, &irq3);

irqISR(irq4, isr4);
MotorWheel wheel4(10, 7, 18, 19, &irq4);

Omni4WD Omni(&wheel1, &wheel2, &wheel3, &wheel4);

unsigned int __SPEED__ = 100;

void __move_forward__(int value)
{
    Omni.setCarAdvance(__SPEED__);
    Omni.delayMS(value * 1000 / __SPEED__);
}

void __move_backward__(int value)
{
    Omni.setCarBackoff(__SPEED__);
    Omni.delayMS(value * 1000 / __SPEED__);
}

void __turn_right__(int angle)
{
    Omni.setCarRotateRight(__SPEED__);
    Omni.delayMS(angle * 1000 / __SPEED__);
}

void __turn_left__(int angle)
{
    Omni.setCarRotateLeft(__SPEED__);
    Omni.delayMS(angle * 1000 / __SPEED__);
}

void ___set_speed___(int speed)
{
    __SPEED__ = speed;
}

int __get_speed__()
{
    return __SPEED__;
}

void setup()
{
    // TCCR0B=TCCR0B&0xf8|0x01;    // warning!! it will change millis()
    TCCR1B = TCCR1B & 0xf8 | 0x01; // Pin9,Pin10 PWM 31250Hz
    TCCR2B = TCCR2B & 0xf8 | 0x01; // Pin3,Pin11 PWM 31250Hz

    Omni.PIDEnable(0.31, 0.01, 0, 10);
}
void loop()
{
    int nb_square = 1;
    while (nb_square <= 4)
    {
        __move_forward__(150);
        __turn_right__(90);
        __move_forward__(150);
        __turn_right__(90);
        __move_forward__(150);
        __turn_right__(90);
        __move_forward__(150);
        __turn_right__(90);
        nb_square = nb_square + 1

            ;
    };
    return;
}

void print_something()
{
    Serial.println("Hello World");
}
