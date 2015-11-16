"""
Until someone builds a good RPIO library for Node, I will be using

"""
import zerorpc
from RPIO import PWM

if not PWM.is_setup():
    PWM.setup(pulse_incr_us=1)
    PWM.set_loglevel(PWM.LOG_LEVEL_ERRORS)
    PWM.init_channel(1,3000)

class RPIOHelper(object):
    def addChannelPulse(self, gpio, rate):
        PWM.add_channel_pulse(1, gpio, 0, int(rate))

s = zerorpc.Server(RPIOHelper())
s.bind("tcp://0.0.0.0:4242")
s.run()
