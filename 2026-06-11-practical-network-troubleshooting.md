# Practical Network Troubleshooting: A Layered Method That Saves Time

## Introduction

Network problems are often noisy but not obvious. A user says "the app is down", yet the real issue might be DNS, routing, a firewall rule, or a service listening on the wrong interface. The fastest way to troubleshoot is not to guess. It is to move methodically through the stack and gather evidence at each layer.

This article covers a practical workflow for diagnosing networking issues on Linux or any Unix-like system. The examples focus on common command-line tools because they remain the most reliable way to understand what is actually happening on the wire.

## Start With the Symptom

Before opening a terminal, define the problem precisely:

### What is failing?

Is the issue name resolution, connection setup, slow response time, packet loss, or complete downtime?

### Where is it failing?

Does it affect one machine, one subnet, one service, or all traffic?

### When did it begin?

Did it start after a deployment, a network change, a certificate renewal, or a firewall update?

These questions prevent a common mistake: treating every outage like the same outage.

## A Layered Troubleshooting Workflow

### 1. Check local reachability

Start at the client. Can the host reach its gateway? Can it resolve names? Can it reach a known stable endpoint?

Useful commands:

```bash
ip addr show
ip route
ping -c 3 8.8.8.8
ping -c 3 example.com
```

If IP connectivity works but DNS fails, the problem may be with the resolver configuration rather than the network path itself.

### 2. Test DNS separately

DNS is frequently blamed for broader issues. Verify it directly instead of assuming it works because a browser opens.

```bash
dig example.com
dig @1.1.1.1 example.com
resolvectl status
```

Compare the results from the default resolver and an external resolver. If one works and the other does not, you have narrowed the issue significantly.

### 3. Confirm the route

If a service is reachable by IP but not by hostname, the path may still be fine. If packets do not leave the local network, inspect routing and firewall rules.

```bash
traceroute example.com
tracepath example.com
ip route get 203.0.113.10
```

These commands show where traffic is likely going and where it stops. Be careful interpreting traceroute on modern networks because some routers rate-limit ICMP responses or intentionally hide internal topology.

### 4. Verify the service is listening

If the remote host is under your control, confirm the process is bound to the expected address and port.

```bash
ss -tulpn
sudo lsof -iTCP -sTCP:LISTEN -P -n
```

It is easy to start a service on `127.0.0.1` and then wonder why remote clients cannot connect. Binding to localhost makes the service accessible only from the machine itself.

### 5. Inspect packets when needed

When the higher-level checks do not reveal the issue, capture traffic. Packet captures show whether SYN packets are leaving, whether replies return, and whether TLS handshakes complete.

```bash
sudo tcpdump -i eth0 port 443
sudo tcpdump -i eth0 host 203.0.113.10 and port 53
```

Packet capture is often the difference between "it feels broken" and "the firewall is dropping return traffic".

## Example: Diagnosing a Failing HTTPS Request

Suppose `curl https://api.internal.example` hangs. A structured approach might look like this:

```bash
getent hosts api.internal.example
curl -v https://api.internal.example
curl -v --resolve api.internal.example:443:10.0.2.15 https://api.internal.example
ss -tnp | grep 443
```

If `--resolve` works, DNS is probably the issue. If DNS works but the connection stalls, inspect routing, firewalls, or the server's TLS configuration. If the server listens but only on loopback, the issue is local binding.

## Tools That Reveal Different Layers

### `ping`

Good for basic reachability and latency, but not enough by itself. A host can block ICMP and still serve traffic.

### `curl`

Excellent for application-layer checks because it shows headers, TLS details, redirects, and HTTP status codes.

### `ss`

Useful for sockets, listening ports, and established connections.

### `tcpdump`

The most direct view of network traffic. It is especially valuable when firewalls, NAT, or asymmetric routing are suspected.

### `mtr`

Combines ping and traceroute to show latency and loss across hops over time. Great for spotting unstable links.

## Best Practices

- Start with the smallest reproducible test.
- Separate name resolution, routing, transport, and application-layer checks.
- Record the exact command and output when escalating issues.
- Compare a working host with a failing host.
- Test from both sides when possible: client and server.
- Use packet captures only after simpler checks narrow the scope.
- Confirm firewall rules, security groups, and load balancer health checks.

## Common Mistakes

- Assuming that "the network" is one thing.
- Using only `ping` and ignoring TCP or TLS behavior.
- Forgetting to check local DNS caches.
- Overlooking local firewalls and interface binding.
- Testing from a different network and assuming the result applies everywhere.
- Ignoring MTU, fragmentation, or packet loss on long paths.
- Changing multiple variables at once and losing the evidence trail.

## Conclusion

Good network troubleshooting is less about memorizing commands and more about building a reliable sequence of questions. Can the host resolve names? Can it reach the route? Is the port open? Does the packet flow match expectations? Each answer removes uncertainty.

When you work layer by layer, even a messy outage becomes manageable. The problem may still be difficult, but it becomes visible, and visibility is what turns guesswork into engineering.

## References

- `man ip`, `man ss`, `man tcpdump`, `man curl`
- RFC 791, Internet Protocol: https://www.rfc-editor.org/rfc/rfc791
- RFC 1034, Domain Names: Concepts and Facilities: https://www.rfc-editor.org/rfc/rfc1034
- The Linux Documentation Project: https://tldp.org/

