import type { DemoFormulas } from "../types";

const tex = String.raw;

// Sections 07-11 of the notes: polar operations, De Moivre, Euler, roots,
// exponential and logarithm. Explanations live in ./text/<lang>.json.
export const complexPolar = {
  "cx-pprod": {
    figures: ["cx-prod"],
    statement: tex`(\rho_1)_{\theta_1} \cdot (\rho_2)_{\theta_2} = (\rho_1\rho_2)_{\theta_1 + \theta_2}`,
    steps: [
      tex`z = \rho_1(\Cos\alpha + i\Sin\alpha),\quad w = \rho_2(\Cos\beta + i\Sin\beta)`,
      tex`zw = \rho_1\rho_2(\Cos\alpha + i\Sin\alpha)(\Cos\beta + i\Sin\beta)`,
      tex`= \rho_1\rho_2[(\Cos\alpha\,\Cos\beta - \Sin\alpha\,\Sin\beta) + i(\Sin\alpha\,\Cos\beta + \Cos\alpha\,\Sin\beta)]`,
      tex`= \rho_1\rho_2[\hl{\Cos(\alpha + \beta)} + i\,\hl{\Sin(\alpha + \beta)}]`,
      tex`= (\rho_1\rho_2)_{\alpha + \beta}`,
      tex`\alpha + \beta \notin (-\pi, \pi] \;\Rightarrow\; \pm 2\pi`,
    ],
  },
  "cx-pquot": {
    figures: ["cx-quot"],
    statement: tex`\dfrac{(\rho_1)_{\theta_1}}{(\rho_2)_{\theta_2}} = \left(\dfrac{\rho_1}{\rho_2}\right)_{\theta_1 - \theta_2}`,
    steps: [
      tex`q = \dfrac{z}{w} \;\Leftrightarrow\; q \cdot w = z`,
      tex`q = r_\varphi \;\Rightarrow\; r_\varphi \cdot (\rho_2)_{\theta_2} = (r\rho_2)_{\varphi + \theta_2}`,
      tex`(r\rho_2)_{\varphi + \theta_2} = (\rho_1)_{\theta_1} \;\Rightarrow\; r\rho_2 = \rho_1,\quad \varphi + \theta_2 = \theta_1`,
      tex`r = \dfrac{\rho_1}{\rho_2},\qquad \varphi = \theta_1 - \theta_2`,
    ],
  },
  "cx-pconj": {
    figures: ["cx-inv"],
    statement: tex`\overline{\rho_\theta} = \rho_{-\theta},\qquad (\rho_\theta)^{-1} = \left(\dfrac{1}{\rho}\right)_{-\theta}`,
    steps: [
      tex`\rho_\theta = \rho\Cos\theta + i\rho\Sin\theta`,
      tex`\overline{\rho_\theta} = \rho\Cos\theta - i\rho\Sin\theta = \rho\Cos(-\theta) + i\rho\Sin(-\theta)`,
      tex`= \rho_{-\theta}`,
      tex`\dfrac{1}{\rho_\theta} = \dfrac{1_0}{\rho_\theta} = \left(\dfrac{1}{\rho}\right)_{0 - \theta} = \left(\dfrac{1}{\rho}\right)_{-\theta}`,
    ],
  },
  "cx-moivre": {
    figures: ["cx-moivre"],
    statement: tex`(\Cos\theta + i\Sin\theta)^n = \Cos n\theta + i\Sin n\theta`,
    steps: [
      tex`(\rho_\theta)^n = \rho_\theta \cdot \rho_\theta \cdots \rho_\theta`,
      tex`= (\rho \cdot \rho \cdots \rho)_{\theta + \theta + \cdots + \theta} = (\rho^n)_{n\theta}`,
      tex`\rho = 1:\quad (1_\theta)^n = 1_{n\theta}`,
      tex`(\Cos\theta + i\Sin\theta)^n = \Cos n\theta + i\Sin n\theta`,
      tex`n = 2:\ \Cos^2\theta - \Sin^2\theta + 2i\Sin\theta\,\Cos\theta = \Cos 2\theta + i\Sin 2\theta`,
      tex`(1 + i)^8 = \left(\sqrt{2}_{\pi/4}\right)^8 = 16_{2\pi} = 16`,
    ],
  },
  "cx-rot": {
    figures: ["cx-rot"],
    statement: tex`(x + yi) \cdot 1_\beta \;=\; \W{rotate}\ \beta`,
    steps: [
      tex`1 \cdot (\Cos\beta + i\Sin\beta) = \Cos\beta + i\Sin\beta`,
      tex`i \cdot (\Cos\beta + i\Sin\beta) = -\Sin\beta + i\Cos\beta`,
      tex`(1, 0) \to (\Cos\beta, \Sin\beta),\qquad (0, 1) \to (-\Sin\beta, \Cos\beta)`,
      tex`\beta = 90\degree:\quad (1, 0) \to (0, 1),\qquad (0, 1) \to (-1, 0)`,
      tex`1_{30\degree} \cdot 1_{90\degree} = 1_{120\degree} = -\dfrac{1}{2} + \dfrac{\sqrt{3}}{2}i`,
    ],
  },
  "cx-euler": {
    figures: ["cx-phasor-e"],
    statement: tex`e^{i\theta} \coloneqq \Cos\theta + i\Sin\theta = 1_\theta`,
    steps: [
      tex`e^{i\theta} \coloneqq \Cos\theta + i\Sin\theta\quad (\theta\ \W{in}\ \Rad)`,
      tex`|e^{i\theta}| = \sqrt{\Cos^2\theta + \Sin^2\theta} = \sqrt{1} = 1`,
      tex`\operatorname{Arg}(e^{i\theta}) = \theta\quad (\theta \in (-\pi, \pi])`,
      tex`\rho_\theta = \rho(\Cos\theta + i\Sin\theta) = \rho e^{i\theta}`,
      tex`e^{i\pi} = \Cos\pi + i\Sin\pi = -1 \quad\Rightarrow\quad e^{i\pi} + 1 = 0`,
    ],
  },
  "cx-cossin": {
    figures: ["cx-euler"],
    statement: tex`\Cos\theta = \dfrac{e^{i\theta} + e^{-i\theta}}{2},\qquad \Sin\theta = \dfrac{e^{i\theta} - e^{-i\theta}}{2i}`,
    steps: [
      tex`e^{i\theta} = \Cos\theta + i\Sin\theta`,
      tex`e^{-i\theta} = \Cos(-\theta) + i\Sin(-\theta) = \Cos\theta - i\Sin\theta`,
      tex`e^{i\theta} + e^{-i\theta} = 2\Cos\theta \hl{{}+ i\Sin\theta - i\Sin\theta}`,
      tex`\Cos\theta = \dfrac{e^{i\theta} + e^{-i\theta}}{2}`,
      tex`e^{i\theta} - e^{-i\theta} = 2i\Sin\theta \hl{{}+ \Cos\theta - \Cos\theta}`,
      tex`\Sin\theta = \dfrac{e^{i\theta} - e^{-i\theta}}{2i}`,
    ],
  },
  "cx-eprop": {
    figures: ["cx-prod-e"],
    statement: tex`(e^{i\theta})^n = e^{in\theta},\qquad e^{i(\theta + \omega)} = e^{i\theta}e^{i\omega}`,
    steps: [
      tex`e^{i\theta} \cdot e^{i\omega} = 1_\theta \cdot 1_\omega = 1_{\theta + \omega} = e^{i(\theta + \omega)}`,
      tex`(e^{i\theta})^n = (1_\theta)^n = 1_{n\theta} = e^{in\theta}`,
      tex`(\rho e^{i\theta})(r e^{i\omega}) = \rho r\, e^{i(\theta + \omega)}`,
    ],
  },
  "cx-roots": {
    figures: ["cx-roots"],
    statement: tex`\sqrt[n]{\rho_\theta} = \left\{ \left(\sqrt[n]{\rho}\right)_{\frac{\theta + 2\pi k}{n}} : k = 0, \ldots, n - 1 \right\}`,
    steps: [
      tex`w = r_\varphi,\quad w^n = z = \rho_\theta`,
      tex`w^n = (r^n)_{n\varphi}`,
      tex`r^n = \rho \;\Rightarrow\; r = \sqrt[n]{\rho}`,
      tex`n\varphi = \theta + \hl{2\pi k} \;\Rightarrow\; \varphi = \dfrac{\theta + 2\pi k}{n}`,
      tex`k = 0, 1, \ldots, n - 1`,
      tex`\varphi_{k+1} - \varphi_k = \dfrac{2\pi}{n}`,
    ],
  },
  "cx-root1": {
    figures: ["cx-roots3"],
    statement: tex`\sqrt[3]{1} = \left\{ 1,\ \dfrac{-1 \pm \sqrt{3}\,i}{2} \right\}`,
    steps: [
      tex`z = 1:\quad \rho = 1,\ \theta = 0 \quad\Rightarrow\quad z = 1_0`,
      tex`\sqrt[3]{1_0} = \left\{ 1_{\frac{0 + 2\pi k}{3}} : k = 0, 1, 2 \right\}`,
      tex`k = 0:\quad 1_0 = 1`,
      tex`k = 1:\quad 1_{2\pi/3} = \Cos\dfrac{2\pi}{3} + i\Sin\dfrac{2\pi}{3} = -\dfrac{1}{2} + \dfrac{\sqrt{3}}{2}i = \omega`,
      tex`k = 2:\quad 1_{4\pi/3} = -\dfrac{1}{2} - \dfrac{\sqrt{3}}{2}i = \overline{\omega} = \omega^2`,
      tex`k = 3:\quad 1_{2\pi} = 1_0`,
    ],
  },
  "cx-z38": {
    figures: ["cx-roots8"],
    statement: tex`z^3 - 8 = 0 \quad\Rightarrow\quad z \in \{ 2,\ -1 \pm \sqrt{3}\,i \}`,
    steps: [
      tex`z^3 - 8 = 0 \;\Rightarrow\; z^3 = 8 \;\Rightarrow\; z \in \sqrt[3]{8}`,
      tex`z^3 - 8 = 0 \;\Rightarrow\; \left(\dfrac{z}{2}\right)^3 - 1 = 0\quad (2 \cdot 2 \cdot 2 = 8)`,
      tex`\dfrac{z}{2} \in \sqrt[3]{1} = \left\{ 1,\ \dfrac{-1 \pm \sqrt{3}\,i}{2} \right\}`,
      tex`z \in \{ 2,\ -1 \pm \sqrt{3}\,i \}`,
      tex`8_0:\quad \sqrt[3]{8} = 2,\quad \varphi = 0,\ \dfrac{2\pi}{3},\ \dfrac{4\pi}{3}`,
    ],
  },
  "cx-exp": {
    figures: ["cx-exp"],
    statement: tex`e^z \coloneqq e^{\operatorname{Re} z}\, e^{i \operatorname{Im} z}`,
    steps: [
      tex`z = a + bi \;\Rightarrow\; e^z = e^{a + bi} = e^a e^{bi}`,
      tex`= e^a(\Cos b + i\Sin b) = (e^a)_b`,
      tex`|e^z| = e^{\operatorname{Re} z}`,
      tex`\arg(e^z) = \operatorname{Im} z + 2\pi k`,
      tex`e^{z + 2\pi i} = e^z \cdot e^{2\pi i} = e^z \cdot 1 = e^z`,
      tex`e^{1 + i\pi/2} = e \cdot e^{i\pi/2} = e \cdot i`,
    ],
  },
  "cx-log": {
    figures: ["cx-log"],
    statement: tex`\log z = \ln|z| + i\arg z,\qquad \operatorname{Log} z = \ln|z| + i\operatorname{Arg} z`,
    steps: [
      tex`e^w = z,\quad w = x + yi`,
      tex`e^w = (e^x)_y = \rho_\theta`,
      tex`e^x = \rho \;\Rightarrow\; x = \ln\rho = \ln|z|`,
      tex`y = \theta + 2\pi k \;\Rightarrow\; \log z = \ln|z| + i(\theta + 2\pi k)`,
      tex`\operatorname{Log} z = \ln|z| + i\operatorname{Arg} z`,
      tex`\operatorname{Log}(-1) = \ln 1 + i\pi = i\pi`,
    ],
  },
} satisfies Record<string, DemoFormulas>;
